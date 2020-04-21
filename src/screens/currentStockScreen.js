import React,{Component} from 'react';
import {View,Text} from 'react-native';
import { DataTable } from 'react-native-paper';

export default class StockScreen extends Component {


constructor(props) {
    super(props);
    this.state = {
      tableData: [
        {id:'p00001',name:'Item1', price:100, quantity:5},
        {id:'p00002',name:'Item2', price:200, quantity:7},
        {id:'p00003',name:'Item3', price:150, quantity:10},
        {id:'p00004',name:'Item4', price:250, quantity:20},
        {id:'p00005',name:'Item5', price:400, quantity:10},
        {id:'p00006',name:'Item6', price:100, quantity:5},
      ],
      total:0
    }
  }

  render() {
    return (
      <View style={{padding:20}}>
      <Text style={{fontWeight: "bold",marginVertical: 4,fontSize:20,textAlign :'center',marginVertical:20}}>Stock In Hand</Text>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>ID</DataTable.Title>
          <DataTable.Title >Name</DataTable.Title>
          <DataTable.Title >Unit Price</DataTable.Title>
          <DataTable.Title numeric>Quantity</DataTable.Title>
        </DataTable.Header>
{
          this.state.tableData.map((item,index) => {
          return (
            <DataTable.Row
              key={item.id}

            >
              <DataTable.Cell>
                {item.id}
              </DataTable.Cell>
              <DataTable.Cell >
                {item.name}
              </DataTable.Cell>
              <DataTable.Cell >
                  {'Rs. '+item.price}
                </DataTable.Cell>
              <DataTable.Cell numeric>
                {item.quantity}
              </DataTable.Cell>

            </DataTable.Row>
        )})}

        <DataTable.Pagination
          page={1}
          numberOfPages={3}
          onPageChange={(page) => { console.log(page); }}
          label="1-2 of 6"
        />
      </DataTable>
      </View>
    );
  }
}
