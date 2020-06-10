import React, {Component} from 'react';
import { StyleSheet, View, Image, Text, FlatList } from 'react-native';
import { Card, FAB, Button } from 'react-native-paper';
import {connect} from "react-redux";
import {showOtherUsers} from "../Utils";
import storage from '@react-native-firebase/storage';

class othersAccountScreen extends React.Component {

    state = {
          salespersonData : [],
          picture: ""
    };

    componentDidMount = async () => {
        const salesperson = await showOtherUsers(this.props.user.supervisorUid);
        this.setState({
            salespersonData: salesperson,
        })
    };

    render () {
    return (
        <View style={{flex:1}}>
        {
        this.state.salespersonData.map((item) => {
            return (
                <View key={item.email}>
                    {renderList(item, this.props)}
                </View>
        )})}
        </View>
    );
    }
}

    getImage = async(email) => {
        const url= "";
        url = await storage()
            .ref('images/'+email)
            .getDownloadURL()
            .then(url => {this.setState({picture: url});})
            .catch(e=>{console.log(e);});
        const image = "";
        if (url == "") {
            image = "../assets/default-profile.jpg";
        } else {
            image = url;
        }
        return image;
    }

        const renderList = ((item, props)=>{
            return(
                <Card style={styles.mycard} onPress={() => props.navigation.navigate("ShowOthersAccount",item)}>
                    <View style={styles.cardView}>
                        <Image style={styles.image} source={require('../assets/default-profile.jpg')}/>
                        <View style={styles.textStyle}>
                            <Text style={{fontSize:20}}>{item.name}</Text>
                            <Text>{item.region}</Text>
                        </View>
                    </View>
                </Card>
            );
        })

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