class TransactionList extends React.Component {
  render () {

    const overscanRowCount = 10;

    return (
      <ReactVirtualized.AutoSizer>
      {
        ({width, height}) => {
          return <ReactVirtualized.List
            width={width}
            height={height}
            overscanRowCount={overscanRowCount}
          />
        }
      }
      </ReactVirtualized.AutoSizer>
    );
  }
}