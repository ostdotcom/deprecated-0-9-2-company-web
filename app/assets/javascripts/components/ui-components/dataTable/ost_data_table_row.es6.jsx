class OstDataTableRow extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      data: props.data,
      needsRefresh: 0 //Change this count to update the table.
    };

    this.getData.bind( this );
    this.setData.bind( this );
    this.forceUIUpdate.bind( this );
  }

  getData () {
    return this.state.data;
  }

  setData ( data, forceUpdate ) {
    if ( data != this.state.data ) {
      this.state.data = data;  
      console.log("state date updated!", data);
      
    } else if ( forceUpdate ) {
      this.forceUIUpdate();
    }

  }

  forceUIUpdate () {
    this.setState({
      needsRefresh: (this.state.needsRefresh + 1)
    })    
  }

  render () {
    const data = this.getData()
        , dataKeys = Object.keys( data )
        , len  = dataKeys.length
        , cols = []
    ;
    
    for(var cnt = 0; cnt < len; cnt++ ) {
      let dataKey = dataKeys[ cnt ];
      let dataValue = data[ dataKey ];
      cols.push(<div className='col'><h4>{dataKey}</h4><div>{dataValue}</div></div>);
    }

    return  <div className="container">
              <div className="row">{cols}</div>
            </div>;
           
  }
}
OstDataTableRow.defaultProps = {
  data: {},
  rowIndex: -1,
  eventNameSpace: "ost.datatable.row.missing.namespace",
  eventPayload: {}
};


