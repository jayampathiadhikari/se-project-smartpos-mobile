import React, {Component} from 'react';
import { StyleSheet, View, Image, Text, Linking, Platform } from 'react-native';
import {Title, Card, Button} from 'react-native-paper';
import * as Permissions from 'expo-permissions';
import {LinearGradient} from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class myAccountScreen extends React.Component {

    openDial () {
        if(Platform.OS === "android"){
            Linking.openURL("tel:12345")
        }else{
            Linking.openURL("telprompt:12345")
        }
    }

    static navigationOptions = ({navigation}) => {
        // const{ params} = navigation.state;
        return {
          title: 'My Account',
        };
      };

    render () {
        return (
            <View style={styles.root} >
                <LinearGradient
                    colors={["#0033ff","#6bc1ff"]}
                    style={{height:"20%"}}
                />
                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={ require('../assets/logo-pos-600.png')  }/>
                </View>
                <View style={{alignItems:"center", margin:15}}>
                    <Title>Shashini</Title>
                    <Text style={{fontSize:18}}>Matara</Text>
                </View>
                <Card style={styles.myCard} onPress={()=>{Linking.openURL("mailto:someone@example.com")}} >
                    <View style={styles.cardContent}>
                        <Ionicons name="ios-mail" size={32} color="#4c57ed" />
                        <Text style={styles.mytext}>shashini@gmail.com</Text>
                    </View>
                </Card>
                <Card style={styles.myCard} onPress={this.openDial.bind(this)} >
                    <View style={styles.cardContent}>
                        <Ionicons name="ios-call" size={32} color="#4c57ed" />
                        <Text style={styles.mytext}>0123456789</Text>
                    </View>
                </Card>
                <Card style={styles.myCard}>
                    <View style={styles.cardContent}>
                        <Ionicons name="logo-usd" size={32} color="#4c57ed" />
                        <Text style={styles.mytext}>100</Text>
                    </View>
                </Card>
                <View style={{flexDirection:"row", justifyContent:"space-around", padding:10}}>
                    <Button icon="account-edit" mode="contained" theme={theme} onPress={() => this.props.navigation.navigate("EditAccount")}>
                        Edit
                    </Button>
                    <Button icon="delete" mode="contained" theme={theme} onPress={()=>console.log("press")}>
                        Delete Profile
                    </Button>
                </View>
            </View>
        );
    }
}

const theme = {
    colors:{
        primary:"#4c57ed"
    }
}

const styles = StyleSheet.create({
    root:{
        flex:1
    },
    image:{
        width:140,
        height:140,
        borderRadius:70,
        marginTop:-50
    },
    imageContainer:{
        alignItems:"center"
    },
    myCard:{
        margin: 3
    },
    cardContent:{
        flexDirection: "row",
        padding:8
    },
    mytext:{
        fontSize:18,
        marginTop: 3,
        marginLeft: 5
    }
});