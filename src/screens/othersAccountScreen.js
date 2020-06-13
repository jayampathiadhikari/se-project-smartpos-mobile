import React, {Component} from 'react';
import { StyleSheet, View, Image, Text, FlatList } from 'react-native';
import { Card, FAB, Button } from 'react-native-paper';
import {connect} from "react-redux";
import {showOtherUsers} from "../Utils";
import storage from '@react-native-firebase/storage';

class othersAccountScreen extends React.Component {

    constructor(props){
        super(props)
        this.state = {
              salespersonData : [],
              imageArray : [],
              picture: "",
        }
    }
    async componentDidMount() {
        const salesperson = await showOtherUsers(this.props.user.supervisorUid);
        this.setState({
            salespersonData: salesperson,
        });
        const url =await storage().ref('images/salesp@mailcupp.com').getDownloadURL()
        .then(url => {this.setState({picture: url});}).catch(e=>{console.log(e);});
    }

    render () {
    return (
        <View style={{flex:1}}>
        {
        this.state.salespersonData.map((item) => {
            let image;
            if (item.imageUri) {
                image = <Image style={styles.image} source={{ uri: item.imageUri }}/>;
            } else {
                image = <Image style={styles.image} source={require('../assets/default-profile.jpg')}/>;
            }
            return (
                <View key={item.email}>
                    <Card style={styles.mycard} onPress={() => this.props.navigation.navigate("ShowOthersAccount",item)}>
                        <View style={styles.cardView}>
                            {image}
                            <View style={styles.textStyle}>
                                <Text style={{fontSize:20}}>{item.name}</Text>
                                <Text>{item.region}</Text>
                            </View>
                            </View>
                    </Card>
                </View>
        )})}
        </View>
    );
    }
}

const mapStateToProps = (state) => ({
  user: state.AuthenticationReducer.user,
});

const bindAction = (dispatch) => ({

});

export default connect(
  mapStateToProps,
  bindAction
)(othersAccountScreen);

const styles = StyleSheet.create({
    mycard: {
        flexDirection:'row',
        margin: 5,
        backgroundColor: '#e4e5f7'
    },
    textStyle: {
        fontSize:18,
        marginLeft: 10
    },
    image:{
        width: 60,
        height: 60,
        borderRadius: 30
    },
    cardView:{
        flexDirection:'row',
        padding:6
    },
    fab:{
        position: 'absolute',
        margin: 16,
        right:0,
        bottom:0
    }
});