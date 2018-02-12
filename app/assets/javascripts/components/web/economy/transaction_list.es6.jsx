class TransactionList extends React.Component {
  
  constructor(props, context) {
    super(props, context);

    console.info("constructor called!");
    console.log( arguments );

    this.transactions = [];
    
    this._addDummyData = this._addDummyData.bind( this );
    this.rowRenderer = this.rowRenderer.bind(this);
    this.dataRowRenderer = this.dataRowRenderer.bind( this );
    this.loadingRowRenderer = this.loadingRowRenderer.bind( this );
    this.rowCount = this.rowCount.bind(this); //<-- This does not work yet!
    this.fetchData = this.fetchData.bind(this);
    this.processResponse = this.processResponse.bind( this );
    this.onRowsRendered = this.onRowsRendered.bind( this );
    this.getRowHeight = this.getRowHeight.bind( this );

    this.state = {
      isLoading: true, /* A flag that is set when next page is being loaded on scroll. */
      rowCount: 0
    };

    this.meta = null; // This will come from backend.
    //Fetch data from backend - For now uses setTimeout and generates dummy data.
    this.fetchData();

    //This is for generating dummy data.
    this._dummy_id = 0;
  }



  
  render () {
    return (
      <ReactVirtualized.AutoSizer>
      {
        ({width, height}) => {
          return <ReactVirtualized.List
            width={width}
            height={height}
            rowHeight={this.getRowHeight}
            overscanRowCount={10}
            className="transactionList"
            rowCount={this.transactions.length}
            rowRenderer= {this.rowRenderer}
            onRowsRendered = {this.onRowsRendered}
          />
        }
      }
      </ReactVirtualized.AutoSizer>
    );
  }

  rowCount () {
    var rowCount = this.transactions.length;
    if ( this.state.isLoading || (this.meta && this.meta.next_page_payload ) ) {
      //Next page is available.
      rowCount = rowCount + 1; //Last row to show loading.
    } 
    return rowCount;
  }

  rowRenderer ({
    key,         // Unique key within array of rows
    index,       // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible,   // This row is visible within the List (eg it is not an overscanned row)
    style        // Style object to be applied to row (to position it)
  }) {
    // console.log("rowRenderer called!");
    const oThis = this;
    if ( index <  this.transactions.length ) {
      // console.log("dataRowRenderer :: index",index, "this.transactions.length", this.transactions.length);
      return oThis.dataRowRenderer.apply(oThis, arguments);
    } else {
      // console.log("loadingRowRenderer :: index",index, "this.transactions.length", this.transactions.length);
      return oThis.loadingRowRenderer.apply(oThis, arguments);
    }
  }

  loadingRowRenderer ({
    key,         // Unique key within array of rows
    index,       // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible,   // This row is visible within the List (eg it is not an overscanned row)
    style        // Style object to be applied to row (to position it)
  }) {

    return (
      <div
        key={key}
        style={style}
        className="row"
      >
        <div className="col"> Loading ...</div>
      </div>
    )
  }

  dataRowRenderer ({
    key,         // Unique key within array of rows
    index,       // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible,   // This row is visible within the List (eg it is not an overscanned row)
    style        // Style object to be applied to row (to position it)
  }) {
    var data = this.transactions[ index ];

    if ( index >= this.transactions.length ) {
      // console.info("here!");
      // console.log( index, this.transactions.length);
      // console.log( data );
    }

    var coin_sym = "RAC";
    var price_oracle_text = data.use_price_oracle ? "Yes" : "No";


    return (
      <div key={key} style={style}>
        <div className="container">
        <div
          className="row"
        >
          <div className="col-2">{data.transaction_name}</div>
          <div className="col-3">{data.transaction_type}</div>
          <div className="col-1">${data.usd_value}</div>
          <div className="col-1">{data.coin_value}</div>
          <div className="col-1">{price_oracle_text}</div>
          <div className="col-3">API Call</div>
          <div className="col-1">EDIT</div>
        </div>
        </div>
      </div>
    )
  }



  fetchData () {
    // console.log("Fetching next page data");

    const oThis = this;
    if ( !oThis.state.isLoading ) {
      this.setState({
        isLoading: true
      });  
    }

    /*
    * Use Ajax to load data here.
    */
    setTimeout(function () {
      var newData = oThis._addDummyData();
      var meta = {
        next_page_payload: (oThis.transactions.length > 20) ? null : {
          some_backend_param_1: "some_backend_param_value",
          some_backend_param_2: "some_backend_param_value",
          some_backend_param_3: "some_backend_param_value",
          some_backend_param_4: "some_backend_param_value"
        }
      };
      var response = {
        success: true,
        data: {
          "meta": meta,
          "result_type": "transactions", //This is key in which array of data is contained. Need to be read at run time.
          "transactions": newData
        }
      };

      // console.log("Response Generated");
      // console.log( JSON.stringify(response, null, 2) ); //Show this output to Puneet.

      oThis.processResponse( response );
    }, 1000);

  }


  processResponse ( response ) {
    const oThis = this;
    if ( response.success ) {
      const data = response.data;
      oThis.meta = data.meta;
      const result_type = data.result_type;
      const results = data[ result_type ] || [];
      if ( results.length ) {
        Array.prototype.push.apply(oThis.transactions, results);
      }

      oThis.setState({
        isLoading: false,
        rowCount: oThis.transactions.length
      });
    } else {
      oThis.setState({
        isLoading: false
      });
      //To-Do: Show some error.
    }
  }

  onRowsRendered ({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex }) {
    // console.log("onRowsRendered called");
    var oThis = this;
    if ( oThis.meta.next_page_payload && Object.keys( oThis.meta.next_page_payload ).length > 0 ) {
      //It is possible to fetch next page.
      const maxIndx = Math.max(startIndex, stopIndex);
      if ( oThis.transactions.length - maxIndx < 10 ) {
        //Only 10 more rows to go.
        if ( !oThis.state.isLoading ) {
          //Not already loading ?
          oThis.fetchData();
        }
      }
    }
  }

  getRowHeight () {
    // console.info( "getRowHeight called!");
    // console.log( arguments );
    return 90;
  }


  _addDummyData () {
    var newData = [];
    const transaction_types = ["User To User", "Company To User", "User to Company"];
    for( var cnt=0;cnt< 20; cnt++){
      var coin_value = Math.round( Math.random() * 10 );
      var usd_value = coin_value * 0.1;
      usd_value = Math.round(usd_value * 100) / 100;
      this._dummy_id ++;
      var data = {
        transaction_id: this._dummy_id,
        transaction_name: "Transaction " + this._dummy_id,
        transaction_type: transaction_types[ this._dummy_id % transaction_types.length],
        usd_value: usd_value,
        coin_value: coin_value,
        commission: Math.round( Math.random() * 10 ),
        use_price_oracle: Math.round( Math.random() )
      }
      newData.push( data );
      
    }
    return newData;
  }
}