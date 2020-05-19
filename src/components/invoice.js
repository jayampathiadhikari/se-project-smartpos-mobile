import React,{Component} from 'react';
import {View,Text,StyleSheet} from 'react-native';


import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';


export default class Invoice extends Component {


  calTotal () {
      let t=0;
      this.props.data.map((item) => {
        t+=item.price*item.quantity;
      });
      return t;
  }

  render() {
    return (
        <View >
            <Text style={{fontSize:25,fontWeight:'bold',textAlign:'right',marginBottom:15}}>INVOICE </Text>
            <Text style={{fontSize:15,fontWeight:'bold',textAlign:'right'}}>Invoice ID : 60 </Text>
            <Text style={{fontSize:15,fontWeight:'bold',textAlign:'right'}}>Shop ID : {this.props.shop_id} </Text>
            <Text style={{fontSize:15,fontWeight:'bold',textAlign:'right',marginBottom:20}} >Date : {new Date().getDate() + '/' + new Date().getMonth() + '/' + new Date().getFullYear()} </Text>
          <Table borderStyle={{borderColor: 'transparent'}}>
            <Row data={['Name','Unit Price','Quantity','Amount']} style={styles.head} textStyle={styles.textHeader}/>
            {
                this.props.data.filter((item)=>{return item.quantity !== 0;}).map((rowData, index) => (
                  <TableWrapper key={index} style={styles.row}>
                    <Cell key={0} data={rowData.name} textStyle={styles.text}/>
                    <Cell key={1} data={'Rs. '+rowData.price} textStyle={styles.text}/>
                    <Cell key={2} data={rowData.quantity } textStyle={styles.text}/>
                    <Cell key={3} data={rowData.quantity*rowData.price} textStyle={styles.text}/>
                  </TableWrapper>
                ))
              }
          </Table>
          <Text style={{fontSize:15,fontWeight:'bold',textAlign:'right' ,marginTop:10,marginBottom:30}}>Total   :    Rs.{this.calTotal()}</Text>
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