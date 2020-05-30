import React, {Component} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {Button, Card} from 'react-native-elements';
import {connect} from 'react-redux';
import Icon from "react-native-vector-icons/FontAwesome";

const axios = require('axios');


class StockScreen extends Component {

    state = {
        onceFetched: false,
        products: [],
        total: 0,

    };

    componentDidMount() {
        this.getStockDetails();
        // this.interval = setInterval(this.getStockDetails, 20000);

    }

    getStockDetails = () => {
        this.setState({onceFetched: true});
        axios.post("https://se-smartpos-backend.herokuapp.com/stock/viewsalespersonstock",
            {salesperson_id: this.props.user.uid})
            .then((response) => {
                if (response.data.success) {
                    this.setState({products: response.data.data});
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    componentWillUnmount() {
//       clearInterval(this.intervalID);
    }


    render() {
        if (!this.state.onceFetched) {
            return (
                <View style={styles.initialContainer}>
                    <Text style={styles.textLoading}> Loading... </Text>
                </View>);
        } else if (this.state.products.length === 0) {
            return (
                <View style={styles.initialContainer}>
                    <Text style={styles.textLoadTopic}>Stock On
                        Hand</Text>
                    <Text style={{fontSize: 15}}>No products available in the stock</Text>
                    <Button icon={
                        <Icon
                            name="repeat"
                            size={20}
                            color="black"
                        />
                    } buttonStyle={styles.refreshButton} onPress={() => {
                        this.getStockDetails();
                    }}/>
                </View>
            )
        }

        return (
            <View style={{padding: 16}}>
                <Text style={styles.textTopic}>STOCK ON HAND</Text>

                <View style={styles.buttonContainer}>

                    <Button icon={
                        <Icon
                            name="repeat"
                            size={20}
                            color="black"
                        />
                    } buttonStyle={styles.refreshButton} onPress={() => {
                        this.getStockDetails();
                    }}/>

                </View>
                <ScrollView style={{marginBottom: 50}}>
                    <Card title="Details of the products">

                        {
                            this.state.products.map((product, i) => {
                                return (
                                    <View key={i}>
                                        <Text
                                            style={styles.textCardHeader}>{product.name}</Text>
                                        <Text> ID : {product.product_id}</Text>
                                        <Text> Unit Price : Rs.{product.unit_price}</Text>
                                        <Text> Quantity : {product.quantity}</Text>
                                    </View>
                                );
                            })
                        }


                    </Card>
                </ScrollView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    initialContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: 20
    },
    textCardHeader: {
        fontWeight: "bold",
        fontSize: 15,
        marginTop: 15
    },
    textLoadTopic: {
        fontWeight: "bold",
        fontSize: 20,
        textAlign: 'center',
        marginVertical: 20
    },
    textTopic: {
        fontWeight: "bold",
        fontSize: 20,
        textAlign: 'center',
        marginVertical: 20,
        color: '#1F5EC6'
    },
    textLoading: {fontWeight: 'bold', fontSize: 20},
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
const mapStateToProps = (state) => ({
    user: state.AuthenticationReducer.user,
});


export default connect(
    mapStateToProps
)(StockScreen);