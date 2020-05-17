import React,{Component} from 'react';
import {View,Text,StyleSheet,Button} from 'react-native';


import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';


export default class Invoice extends Component {


  calTotal () {
      var t=0;
      this.props.data.map((item) => {
        t+=item.price*item.quantity;
      });
      return t;
  }

  render() {
    return (
        <View >
            <Text>Invoice ID : 10001 </Text>
            <Text>Date : {new Date().getDate() + '/' + new Date().getMonth() + '/' + new Date().getFullYear()} </Text>
          <Table borderStyle={{borderColor: 'transparent'}}>
            <Row data={['Name','Unit Price','Quantity','Amount']} style={styles.head} textStyle={styles.textHeader}/>
            {
                this.props.data.filter((item)=>{return item.quantity != 0;}).map((rowData, index) => (
                  <TableWrapper key={index} style={styles.row}>
                    <Cell key={0} data={rowData.name} textStyle={styles.text}/>
                    <Cell key={1} data={'Rs. '+rowData.price} textStyle={styles.text}/>
                    <Cell key={2} data={rowData.quantity } textStyle={styles.text}/>
                    <Cell key={3} data={rowData.quantity*rowData.price} textStyle={styles.text}/>
                  </TableWrapper>
                ))
              }
          </Table>
          <Text >Total : Rs. {this.calTotal()}</Text>
        </View>
    );
  }
}



const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 25, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#2c3033' },
  textHeader :{margin:7,color:'#fff'},
  text: { margin: 7 },
  textTotal : {margin:10 , fontWeight:"bold"},
  row: { flexDirection: 'row', backgroundColor: '#eeeeee' },
});