import React,{Component} from 'react';
import { Text, StyleSheet, ScrollView} from 'react-native';
import ViewShot from 'react-native-view-shot';
import CameraRoll from "@react-native-community/cameraroll";


import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';


export default class Invoice extends Component {

    onCapture = uri => {
        CameraRoll.save(uri, {album: 'Zenarus'}).then(() => console.log('Successfully saved to the device'))
            .catch(err=>console.log(err))
    }

  calSubTotal= ()=> {
      let t=0;
      this.props.data.products.map((item) => {
        t+=item.price*item.quantity;
      });
      return t;
  }
  calDiscounts =(discountPercentage)=>{
        let discount = this.calSubTotal()*(discountPercentage/100);
        return Math.round(discount);
  }

  calTotal=(discount)=>{
        return ((this.calSubTotal())-(this.calDiscounts(discount)));
  }

  render() {
    const data=this.props.data;
    return (
        <ScrollView >
            <ViewShot onCapture={this.onCapture} captureMode="mount" options={{ format: "jpg", quality: 0.9 }} style={{backgroundColor:'white',padding :20}}>
                <Text style={styles.textInvoice}>INVOICE </Text>
                <Text style={styles.textCompanyName}>ZENARUS</Text>
                <Text style={styles.textCompanyInfo}>Pedlar Street,</Text>
                <Text style={styles.textCompanyInfo}>Colombo 10. </Text>
                <Text style={{...styles.textCompanyInfo, marginBottom:20}}>Phone : 076 772 6503</Text>
                <Text style={{...styles.textCompanyInfo,fontSize:16}}>Bill To  </Text>

                <Text style={styles.textCompanyInfo}>{data.shop_name} </Text>
                <Text style={styles.textCompanyInfo}>(shop id : {data.shop_id} )</Text>
                <Text style={styles.textInfo}>Invoice ID : {data.invoice_id} </Text>
                <Text style={{...styles.textInfo,marginBottom:20}} >Date : {new Date().getDate() + '/' + new Date().getMonth() + '/' + new Date().getFullYear()} </Text>

                <Table borderStyle={{borderColor: 'transparent'}}>
                    <Row data={['Name','Unit Price','Quantity','Amount']} style={styles.head} textStyle={styles.textHeader}/>
            {
                data.products.filter((item)=>{return item.quantity !== 0;}).map((rowData, index) => (
                    <TableWrapper key={index} style={styles.row}>
                        <Cell key={0} data={rowData.name} textStyle={styles.text}/>
                        <Cell key={1} data={rowData.price+'.00'} textStyle={styles.text}/>
                        <Cell key={2} data={rowData.quantity } textStyle={styles.text}/>
                        <Cell key={3} data={(rowData.quantity*rowData.price)+'.00'} textStyle={styles.text}/>
                    </TableWrapper>
                ))
              }
                </Table>
                <Text style={{...styles.textInfoBottom,marginTop:10}}> Sub Total   :  {this.calSubTotal()+'.00'}</Text>
                <Text style={styles.textInfoBottom}> Discounts   : {this.calDiscounts(data.discount)+'.00'}</Text>
                <Text style={{...styles.textInfoBottom,marginTop:15}}>TOTAL   :    Rs.{this.calTotal(data.discount)+'.00'}</Text>
            </ViewShot>
        </ScrollView>
    );
  }
}



const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 25, backgroundColor: '#fff' },
    textInvoice :{fontSize:25,fontWeight:'bold',textAlign:'center',marginBottom:15},
    textInfo:{fontSize:14,fontWeight:'bold',textAlign:'right'},
    textInfoBottom:{fontSize:14,fontWeight:'bold',textAlign:'right' },
    textCompanyInfo:{fontSize:14,fontWeight:'bold',textAlign:'left'},
    textCompanyName:{fontSize:20,fontWeight:'bold',textAlign:'left'},
    head: { height: 40, backgroundColor: '#2c3033' },
    textHeader :{margin:7,color:'#fff',textAlign: 'right'},
    text: { margin: 7 ,textAlign:'right'},
    textTotal : {margin:10 , fontWeight:"bold"},
    row: { flexDirection: 'row', backgroundColor: '#eeeeee' },
});