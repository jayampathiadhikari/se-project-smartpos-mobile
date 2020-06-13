import React, {Component} from 'react';
import {StyleSheet, ScrollView, View, Text, Alert, Modal} from 'react-native';
import {Button} from 'react-native-elements';
import {Table, TableWrapper, Row, Cell} from 'react-native-table-component';
import Invoice from '../components/invoice.js';
import {connect} from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";

const axios = require('axios');

class GenerateInvoiceScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['Name', 'Price', 'Quantity', ''],
            tableData: [],
            total: 0,
            modalVisible: false,
            onceFetched: false,
            invoiceDetails: {}
        }
    }


    componentDidMount() {
        this.getStockDetails();

    }

    getStockDetails = () => {
        this.setState({onceFetched: true});
        axios.post("https://se-smartpos-backend.herokuapp.com/api/v1/stock/viewsalespersonstock",
            {salesperson_id: this.props.user.uid})
            .then((response) => {
                if (response.data.success) {
                    let products = []
                    response.data.data.map((product) => {
                        products.push({
                            id: product.product_id,
                            name: product.name,
                            price: product.unit_price,
                            quantityInStock: product.quantity,
                            quantity: 0
                        });
                    });
                    this.setState({tableData: products});
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    displayInvoice = (invoice_id) => {
        const details = {
            invoice_id: invoice_id,
            products: this.state.tableData,
            shop_id: this.props.navigation.getParam('shop_id'),
            shop_name: this.props.navigation.getParam('shop_name'),
            discount: 0
        }
        this.setState({invoiceDetails: details, modalVisible: true})
    }

    getProductsList = () => {
        let productsList = [];
        this.state.tableData.map((product) => {
            if (product.quantity !== 0) {
                productsList.push({product_id: product.id, quantity: product.quantity});
            }
        });
        return productsList;
    }
    generateInvoice = () => {
        const productsList = this.getProductsList();
        axios.post("https://se-smartpos-backend.herokuapp.com/api/v1/invoice/generateInvoice",
            {
                salesperson_id: this.props.user.uid,
                shop_id: this.props.navigation.getParam('shop_id'),
                products: JSON.stringify(productsList)
            })
            .then((response) => {
                if (response.data.success) {
                    Alert.alert('Invoice Successfully Generated');
                    const invoice_id=response.data.data.invoice_id;
                    this.displayInvoice(invoice_id);

                } else {
                    Alert.alert('Error occured while generating invoice.Try Again 123!');
                }
            })
            .catch(function (error) {
                console.log(error);
                Alert.alert('Error occured while generating invoice.Try Again!');

            });
    };

    incrementQuantity = (i) => {
        this.setState(state => {
            const list = state.tableData.map((item, j) => {
                if (j === i) {
                    const pre_quantity = item.quantity;
                    if (pre_quantity + 1 > item.quantityInStock) {
                        Alert.alert('' ,"Out of Stock : "+ item.name +"")
                        return item;
                    }
                    delete item.quantity;
                    item['quantity'] = pre_quantity + 1;
                    return item;
                } else {
                    return item;
                }
            });
            return {list};
        }, () => {
            this.setState({total: this.calTotal()})
        });
    };

    decrementQuantity = (i) => {

        this.setState(state => {
            const list = state.tableData.map((item, j) => {
                if (j === i && item.quantity !== 0) {
                    const pre_quantity = item.quantity;
                    delete item.quantity;
                    item['quantity'] = pre_quantity - 1;
                    return item;
                } else {
                    return item;
                }
            });
            return {list};
        }, () => {
            this.setState({total: this.calTotal()})
        })
    };

    calTotal = () => {
        let t = 0;
        this.state.tableData.map((item) => {
            t += item.price * item.quantity;
        });
        return t;
    }


    closeModal = async () => {
        await this.getStockDetails();
        this.setState({modalVisible: false, total: 0});
    }

    displayInfo = () => {
        Alert.alert("Info", "Available products in the stock are displayed in a table.\n\n" +
            "Here the quantity of the products can be altered with the use of  + and - buttons.\n\n" +
            "Finally the generated invoice can be accessed via the device gallery for sharing purposes.")
    }

    render() {

        const state = this.state;

        if (state.tableData.length === 0) {
            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center',}}>
                    <Text style={styles.textNoProduct}> No products available in the stock. </Text>
                    <Button icon={
                        <Icon
                            name="repeat"
                            size={20}
                            color="black"
                        />
                    } buttonStyle={styles.refreshButton} onPress={() => {
                        this.getStockDetails()
                    }}/>
                </View>);
        }


        const element = (item_index) => (
            <View style={{flex: 1, flexDirection: 'row', textAlign: 'center'}}>
                <Button title='  +  ' buttonStyle={styles.buttonIncrement} onPress={() => {
                    this.incrementQuantity(item_index)
                }}/>
                <Button title='  -  ' buttonStyle={styles.buttonDecrement} onPress={() => {
                    this.decrementQuantity(item_index)
                }}/>
            </View>
        );

        return (

            // Return a table with available products in the stock in hand
            <View style={styles.root}>
                <ScrollView style={styles.container}>
                    <Button icon={
                        <Icon
                            name="info"
                            size={20}
                            color="black"
                        />
                    } buttonStyle={styles.infoButton} onPress={() => {
                        this.displayInfo()
                    }}/>
                    <Table borderStyle={{borderColor: 'transparent'}}>
                        <Row data={state.tableHead} style={styles.head} textStyle={styles.textHeader}/>
                        {
                            state.tableData.map((rowData, index) => (
                                <TableWrapper key={index} style={styles.row}>
                                    <Cell key={0} data={rowData.name} textStyle={styles.text}/>
                                    <Cell key={1} data={'Rs. ' + rowData.price} textStyle={styles.text}/>
                                    <Cell key={2} data={rowData.quantity} textStyle={styles.text}/>
                                    <Cell key={3} data={element(index)} textStyle={styles.text}/>
                                </TableWrapper>
                            ))
                        }
                    </Table>

                    {this.state.total !== 0 ?
                        <Button title={"Generate invoice for Rs. " + state.total + ".00"} buttonStyle={styles.button}
                                onPress={() => {
                                    this.generateInvoice()
                                }}/>
                        : null
                    }

                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={state.modalVisible}
                    >
                        <View style={{flex: 1, justifyContent: 'center', padding: 20}}>
                            <ScrollView>

                                <Invoice data={this.state.invoiceDetails}/>
                                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 30}}>
                                    <Button title="Ok" buttonStyle={{...styles.modalButton, marginLeft: 10}}
                                            onPress={() => {
                                                this.closeModal();
                                            }}/>
                                </View>
                            </ScrollView>
                        </View>
                    </Modal>


                </ScrollView>

            </View>


        )
    }
}

const styles = StyleSheet.create({
    root: {flex: 1},
    container: {padding: 15},
    head: {height: 50, backgroundColor: '#2c3033', borderRadius: 5},
    textHeader: {margin: 7, color: '#fff'},
    text: {margin: 7},
    textTotal: {margin: 10, fontWeight: "bold"},
    row: {flexDirection: 'row', backgroundColor: '#fff', height: 50},
    button: {borderRadius: 5, marginBottom: 40, marginTop: 20, backgroundColor: "#053d6e"},
    buttonDecrement: {margin: 2, marginTop: 5, padding: 3, backgroundColor: "#af0810"},
    buttonIncrement: {margin: 2, marginTop: 5, padding: 3, backgroundColor: "#053d6e"},
    textNoProduct: {fontWeight: 'bold', fontSize: 15},
    modalButton: {borderRadius: 5, backgroundColor: "#053d6e", paddingLeft: 30, paddingRight: 30, marginBottom: 30},
    infoButton: {
        marginBottom: 10,
        borderRadius: 25,
        marginRight: 15,
        padding: 20,
        height: 30,
        alignSelf: 'flex-end',
        backgroundColor: "#fff"
    },
    refreshButton: {
        marginTop: 10,
        borderRadius: 30,
        marginRight: 15,
        padding: 20,
        height: 30,
        alignSelf: 'flex-end',
        backgroundColor: "#fff"
    }
});


const mapStateToProps = (state) => ({
    user: state.AuthenticationReducer.user,
});


export default connect(
    mapStateToProps
)(GenerateInvoiceScreen);