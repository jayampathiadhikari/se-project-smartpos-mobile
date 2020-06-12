import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, Text, Alert, TouchableOpacity, Modal} from 'react-native';
import {Button, Input} from 'react-native-elements';
import {Table, TableWrapper, Row, Cell} from 'react-native-table-component';

const axios = require('axios');
import Icon from 'react-native-vector-icons/FontAwesome';

export default class SalesDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['Invoice No.', 'Date', 'Total', 'Due Amount'],
            tableData: [],

            updateDueAmountModalVisible: false,
            invoiceToUpdate: '',
            amountReceived: 0,
            onceFetched: false

        }
    }

    componentDidMount() {
        this.getInvoiceDetails();

    }

    getInvoiceDetails = () => {
        this.setState({onceFetched: true});
        axios.post("https://se-smartpos-backend.herokuapp.com/api/v1/invoice/viewallinvoices",
            {shop_id: this.props.navigation.getParam('shop_id')})
            .then((response) => {
                if (response.data.success) {
                    const formattedInvoices=this.formatInvoiceDetails(response.data.data);
                    const invoicesSortedById =this.sortInvoicesById(formattedInvoices);
                    this.sortInvoicesByState(invoicesSortedById);
                }
            })
            .catch(function (error) {
                console.log(error);
            });

    };

    formatInvoiceDetails=(invoiceDetails)=>{
        let invoices = []
        invoiceDetails.map((invoice) => {
            invoices.push({
                id: invoice.invoice_id,
                date: invoice.issued_date,
                total: invoice.invoice_value,
                due: (invoice.invoice_value - invoice.paid_amount)
            });
        });

        return invoices
    }
    sortInvoicesById=(invoices)=>{
        const invoicesSortedByID = invoices.sort(function sortById(a, b) {
                return b.id < a.id ? 1
                    : b.id > a.id ? -1
                        : 0;
            });
        return invoicesSortedByID
    }

    sortInvoicesByState=(invoices)=>{
        const Top=[];
        const Res=[];

        invoices.map((invoice)=>{
            if (invoice.due===0){
                Res.push(invoice);
            }else{
                Top.push(invoice)
            }
        });
        this.setState({tableData:Top.concat(Res),amountReceived: 0})
    }


    updateDatabasePaidAmount = (invoice_id, amountReceived) => {
        axios.put("https://se-smartpos-backend.herokuapp.com/api/v1/invoice/updateinvoicepaidamount",
            {
                "amount_received": amountReceived,
                "invoice_id": invoice_id
            })
            .then((response) => {
                if (response.data.success) {
                    this.setState(state => {
                        const list = state.tableData.map((invoice) => {
                            if (invoice.id === this.state.invoiceToUpdate.id && this.state.amountReceived <= invoice.due) {
                                const due_amount = invoice.due;
                                invoice['due'] = due_amount - this.state.amountReceived;
                                return invoice;
                            } else {
                                return invoice;
                            }
                        });
                        return {list};
                    }, () => {
                        this.sortInvoicesByState(this.state.tableData);
                        this.closeDeuAmountModal();

                        Alert.alert('Successfully Updated')
                    });
                } else {
                    this.setState({amountReceived: 0});
                    this.closeDeuAmountModal();
                    Alert.alert('Error occured while updating. Try Again!');
                }
            })
            .catch(function (error) {
                console.log(error);
                this.setState({amountReceived: 0});
                this.closeDeuAmountModal();
                Alert.alert('Error occured while updating. Try Again!');
            });
    };


    openDueAmountModal = (invoice) => {
        this.setState({invoiceToUpdate: invoice, updateDueAmountModalVisible: true});
    };

    closeDeuAmountModal = () => {
        this.setState({updateDueAmountModalVisible: false, invoiceToUpdate: ''});
    };

    setDueAmount = (amount, total_amount) => {
        if (~isNaN(amount) && amount <= total_amount) {
            this.setState({amountReceived: amount});
        } else {
            Alert.alert('Invalid input.Enter a number less than the due amount')
        }
    }

    displayInfo = () => {
        Alert.alert("Info", "The due amount for each invoices are show in the table.\n\n" +
            "By pressing the due amount , the amount can be altered." +
            "\n\nNote :" +
            "\nFor continuous update make sure to refresh the screen.")
    }

    render() {
        const state = this.state;

        if (!state.onceFetched) {
            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 20}}> Loading... </Text>
                </View>);
        }

        if (state.tableData.length === 0) {
            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center',}}>
                    <Text style={{fontWeight: 'bold', fontSize: 15}}> No sales are recorded. </Text>
                    <Button icon={
                        <Icon
                            name="repeat"
                            size={20}
                            color="black"
                        />
                    } buttonStyle={styles.refreshButton} onPress={() => {
                        this.getInvoiceDetails()
                    }}/>
                </View>);
        }

        const element = (invoice_index, invoice) => {
            if (invoice.due === 0) {
                return (
                    <Button title='Paid'
                            buttonStyle={{alignItems: 'center', backgroundColor: '#0a5a00', padding: 2, marginTop: 1}}
                            titleStyle={{color: '#fff', fontWeight: '100'}}/>
                );
            } else {
                return (
                    <TouchableOpacity key={invoice_index} style={{
                        alignItems: 'center',
                        backgroundColor: '#af0810',
                        padding: 5,
                        marginTop: 1,
                        borderRadius: 3
                    }}
                  onPress={() => {
                      this.openDueAmountModal(invoice)
                  }}>
                        <Text style={{color: '#fff', fontWeight: 'bold'}}>{'Rs. ' + invoice.due}</Text>
                    </TouchableOpacity>
                );
            }
        };

        return (

            // Return a table with invoices details
            <ScrollView style={styles.root}>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: "flex-end"}}>
                    <Button icon={
                        <Icon
                            name="info"
                            size={20}
                            color="black"
                        />
                    } buttonStyle={styles.infoButton} onPress={() => {
                        this.displayInfo()
                    }}/>
                    <Button icon={
                        <Icon
                            name="repeat"
                            size={20}
                            color="black"
                        />
                    } buttonStyle={styles.refreshButton} onPress={() => {
                        this.getInvoiceDetails()
                    }}/>
                </View>

                <View style={styles.container}>

                    <Table borderStyle={{borderColor: 'transparent'}}>

                        <Row data={state.tableHead} style={styles.head} textStyle={styles.textHeader}/>
                        {
                            state.tableData.map((rowData, index) => (
                                <TableWrapper key={index} style={styles.row}>
                                    <Cell key={0} data={rowData.id} textStyle={styles.text}/>
                                    <Cell key={1} data={rowData.date} textStyle={styles.text}/>
                                    <Cell key={2} data={'Rs. ' + rowData.total} textStyle={styles.text}/>
                                    <Cell key={3} data={element(index, rowData)}/>
                                </TableWrapper>
                            ))
                        }
                    </Table>
                </View>
                <Modal animationType="fade" transparent={true} visible={state.updateDueAmountModalVisible}>
                    <View style={modalstyles.centeredView}>
                        <View style={modalstyles.modalView}>
                            <Text style={modalstyles.modalText}>Invoice Id : {state.invoiceToUpdate.id} </Text>
                            <Text style={modalstyles.modalText}>Due Amount : Rs. {state.invoiceToUpdate.due} </Text>
                            <Input
                                placeholder='  Amount Received'
                                errorStyle={{color: 'red', textAlign: 'center'}}
                                errorMessage='Update cannot be rolled back'
                                onChangeText={(amount) => {
                                    this.setDueAmount(amount, state.invoiceToUpdate.due)
                                }}
                            />

                            <Button title='Update' buttonStyle={{...modalstyles.openButton, backgroundColor: "#af0810"}}
                                    onPress={() => {
                                        this.updateDatabasePaidAmount(this.state.invoiceToUpdate.id, this.state.amountReceived)
                                    }}/>
                            <Button title='Cancel' buttonStyle={modalstyles.openButton} onPress={() => {
                                this.closeDeuAmountModal();
                            }}/>


                        </View>
                    </View>
                </Modal>

            </ScrollView>

        )
    }
}


const styles = StyleSheet.create({
    container: {marginTop: 10, paddingLeft: 16, paddingRight: 16, marginBottom: 30, backgroundColor: '#fff'},
    head: {height: 50, backgroundColor: '#2c3033', borderRadius: 5},
    textHeader: {margin: 7, color: '#fff', fontSize: 14, fontWeight: '800'},
    text: {marginTop: 10, marginBottom: 10, marginLeft: 5},
    textTotal: {margin: 10, fontWeight: "bold"},
    row: {flexDirection: 'row', backgroundColor: '#fff'},
    infoButton: {
        marginTop: 10,
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


const modalstyles = StyleSheet.create({
    root: {
        flex: 1
    },
    centeredView: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 240,
    },
    modalView: {
        margin: 10,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",

        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        margin: 8,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
});

