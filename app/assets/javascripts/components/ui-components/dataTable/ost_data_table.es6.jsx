class OstDataTable extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoading: true,
      rowCount: 1, //1 to Show loading
      hasNextPage: true, //To Indicate it has next page.
      needsRefresh: 0 //Change this count to update the table.
    };

    //Properties.
    this.results = [];
    this.lastMeta = null;
    if ( !this.props.parent_id ) {
      throw "Mandetory prop parent_id missing!";
    }

    //Row Component Class
    this.rowConstructor = ReactRailsUJS.getConstructor( props.row_component );

    this._cache = new ReactVirtualized.CellMeasurerCache({
      fixedWidth: true,
      minHeight: this.props.minHeight || 0
    });


    //eventNameSpace can be used by rows to speak with this component.
    var eventNameSpace = props.eventNameSpace;
    if ( !eventNameSpace ) {
      eventNameSpace = "ost.datatable.ts_" + Date.now();
      if ( props.id ) {
        eventNameSpace += "." + props.id;
      }      
    }
    this.eventNameSpace = eventNameSpace; 

    


    //Bind all functions as required.

    //ReactVirtualized Methods
    this.getRowHeight = this.getRowHeight.bind( this );
    this.rowRenderer = this.rowRenderer.bind(this);
    this.resultRenderer = this.resultRenderer.bind( this );
    this.loadingRowRenderer = this.loadingRowRenderer.bind( this );
    this.generateIdForRowIndex = this.generateIdForRowIndex.bind( this );
    this.rowRefTriggered = this.rowRefTriggered.bind( this );

    //ReactVirtualized Events
    this.onRowsRendered = this.onRowsRendered.bind( this );

    //Data Related Methods
    this.fetchData = this.fetchData.bind(this);
    this.fetchDataFromUrl = this.fetchDataFromUrl.bind( this );
    this.processResponse = this.processResponse.bind( this );

    //EveryThing Else

    //Start Fetching Data.
    this.fetchData( true );

  }

  render () {
    var oThis = this;

    return (
      <ReactVirtualized.AutoSizer>
      {
        ({width, height}) => {
          oThis.listComponent =  <ReactVirtualized.List
            width={width}
            height={height}
            deferredMeasurementCache={this._cache}
            rowHeight={this._cache.rowHeight}
            overscanRowCount={10}
            className="transactionList"
            rowCount={this.state.rowCount}
            rowRenderer= {this.rowRenderer}
            onRowsRendered = {this.onRowsRendered}
          />
          return oThis.listComponent;
        }
      }
      </ReactVirtualized.AutoSizer>
    );
  }



  rowRenderer ({
    key,         // Unique key within array of rows
    index,       // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible,   // This row is visible within the List (eg it is not an overscanned row)
    style        // Style object to be applied to row (to position it)
  }) {
    // console.log("rowRenderer called!");
    if ( this.isLoadingRowIndex( index ) ) {
      return this.loadingRowRenderer.apply(this, arguments);
    } else {
      var result = this.results[ index ];
      var args = Array.prototype.slice.call(arguments);
      args.push( result )
      return this.resultRenderer.apply(this, args);
    } 
  }

  isLoadingRowIndex ( index ) {
    return !( index <  this.results.length );
  }

  loadingRowRenderer ({
    key,         // Unique key within array of rows
    index,       // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible,   // This row is visible within the List (eg it is not an overscanned row)
    style        // Style object to be applied to row (to position it)
  }) {

    var inlineStyle = { paddingTop: "15px", paddingBottom: "15px"};
    
    myKey = key + "-" + Date.now();
    return (
      <CellMeasurer
        cache={this._cache}
        columnIndex={0}
        key={key}
        rowIndex={index}
        parent={parent}>
          <div key={myKey} style={{...style}}>
            <div className="container">
              <div className="row">
                <div className="col text-center" style={inlineStyle}>
                  <img src="/ajax-loader.gif" />
                </div>
              </div>
            </div>
          </div>
      </CellMeasurer>
    )
  }

  resultRenderer ({
    key,         // Unique key within array of rows
    index,       // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible,   // This row is visible within the List (eg it is not an overscanned row)
    style        // Style object to be applied to row (to position it)
  }, result) {
    // console.log("DataTable resultRenderer called!", this.props);
    

    if ( index >= this.results.length ) {
      // console.info("here!");
      // console.log( index, this.transactions.length);
      // console.log( data );
    }

    var rowEventPayload = {
      data: result,
      rowIndex: index,
      eventNameSpace: this.eventNameSpace
    };

    var RowConstructor = this.rowConstructor;
    return (
      <CellMeasurer
        cache={this._cache}
        columnIndex={0}
        key={key}
        rowIndex={index}
        parent={parent}> 
        {({measure}) => (    
          <div key={key} style={style}>   
            <ResizeObservable onResize={measure}>
              <RowConstructor
                id={this.generateIdForRowIndex(index)}
                rowEventPayload={rowEventPayload}
                eventNameSpace= {this.eventNameSpace}
                data={result}
                index={index}
                ref={this.rowRefTriggered}
              />
            </ResizeObservable>
          </div>
        )}  
      </CellMeasurer>
    );
  }

  rowRefTriggered ( rowInstance ) {
    if ( !this.sizerRow && this.sizerRowId && this.sizerRowId == rowInstance.props.id ) {
      this.sizerRow = rowInstance;
    }
  }

  generateIdForRowIndex (index) {
    return "ost-datatable-row-" + Math.round( Math.random() * 1000) + "-" + index + "-" + this.eventNameSpace;
  }


  fetchData ( isFirstLoad ) {

    const oThis = this;
    if ( !isFirstLoad && oThis.state.isLoading ) {
      return;
    }
    if ( !isFirstLoad ) {
      //Do not set state when unmounted.
      this.setState({
        isLoading: true
      });      
    }


    const dataSource = this.props.data_source ;
    if ( !dataSource ) {
      console.error("Hey OST⍺ Dev! You forgot to configure data_source prop.");
      return;
    }

    var isDataSourceFunction = false;
    if ( dataSource.indexOf("/") < 0 ) {
      //Data source is not a url. It does not contain '/'
      var functionParts = dataSource.split(".");
      var fnName = functionParts.pop();
      var fnScope = ns( functionParts.join('.') );

      if ( fnScope && typeof fnScope[ fnName ] === 'function') {
        isDataSourceFunction = true;
        //Execute the function.
        fnScope[ fnName ](this.results, this.lastMeta, this.processResponse);
      }
    } 

    if ( !isDataSourceFunction ) {
      //Try and fetch from url.
      this.fetchDataFromUrl( this.results, this.lastMeta, this.processResponse);
    }
  }

  fetchDataFromUrl (data, lastMeta, callback) {
    console.log("Datatable :: fetchDataFromUrl called!");
  }

  processResponse ( response ) {
    console.log("Datatable :: processResponse called!");
    console.log("response", response);
    if ( response.success ) {
      const data = response.data
          , newMeta = data.meta || {}
          , result_type = data.result_type
          , newResults = data[ result_type ] || []
          , nextPagePayload = newMeta.next_page_payload || {}
      ;

      this._cache.clear( this.results.length, 0 );

      //Deal with new results.
      if ( newResults.length ) {
        Array.prototype.push.apply(this.results, newResults);
      }
      var rowCount = this.results.length;

      //Deal with meta
      var hasNextPage = false;
      if ( Object.keys( nextPagePayload ).length ) {
        //We have next page.
        hasNextPage = true;
        rowCount += 1;
      }
      this.lastMeta = newMeta;

      

      // console.log("Setting state. rowCount: ", rowCount);
      this.setState({
        isLoading: false,
        rowCount: rowCount,
        hasNextPage: hasNextPage
      });

    } else {
      this.setState({
        isLoading: false
      });
    }
  }

  onRowsRendered ({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex }) {
    var oThis = this;
    if ( this.state.hasNextPage ) {
      //It is possible to fetch next page.
      const maxIndx = Math.max(startIndex, stopIndex);
      if ( oThis.results.length - maxIndx < 10 ) {
        //Only 10 more rows to go.
        if ( !oThis.state.isLoading ) {
          //Not already loading ?
          oThis.fetchData();
        }
      }
    }
  }

  getRowHeight ( {index} ) {
    var rowHeight = 0;
    if ( this.isLoadingRowIndex( index ) ) {
      rowHeight = 60;
    } else if ( this.sizerRow ) {
      var result = this.results[ index ]
        , row = this.sizerRow
        , domRow = ReactDOM.findDOMNode( row )
      ;
      var oldHeight = $( domRow ).height();
      row.setData(result, true);
      var newHeight = $( domRow ).height();
      console.log( "newHeight", newHeight, "oldHeight",oldHeight, "\n\tdomRow", domRow);
      rowHeight = newHeight;
    }
    return rowHeight || 90;
  }
  

}

OstDataTable.defaultProps = {
  data_source: null,
  row_component: "OstDataTableRow"
};


CellMeasurer = ReactVirtualized.CellMeasurer;