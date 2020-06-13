import React, {Component} from 'react';
import { StyleSheet, View, Image, Text, Linking, Platform } from 'react-native';
import {Title, Card, Button} from 'react-native-paper';
import * as Permissions from 'expo-permissions';
import {LinearGradient} from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import storage from '@react-native-firebase/storage';

export default class othersAccountProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            picture: ""
        }
    }

    async componentDidMount() {
        const url = await storage()
            .ref('images/'+this.props.navigation.getParam('email'))
            .getDownloadURL()
            .then(url => {this.setState({picture: url});})
            .catch(e=>{console.log(e);});
    }

    openDial () {
            if(Platform.OS === "android"){
                Linking.openURL('tel:'+this.props.navigation.getParam('phoneNumber'))
            }else{
                Linking.openURL('telprompt:'+this.props.navigation.getParam('phoneNumber'))
            }
        }

    static navigationOptions = ({navigation}) => {
            // const{ params} = navigation.state;
            return {
              title: "Others",
            };
          };

    render () {
        let image;
        if (this.props.navigation.getParam('imageUri')) {
            image = <Image style={styles.image} source={{ uri: this.props.navigation.getParam('imageUri')}}/>;
        } else {
            image = <Image style={styles.image} source={require('../assets/default-profile.jpg')}/>;
        }
        return (
            <View style={styles.root} >
                <LinearGradient
                    colors={["#0033ff","#6bc1ff"]}
                    style={{height:"20%"}}
                />
                <View style={styles.imageContainer}>
                    {image}
                </View>
                <View style={{alignItems:"center", margin:15}}>
                    <Title>{this.props.navigation.getParam('name')}</Title>
                    <Text style={{fontSize:18}}>{this.props.navigation.getParam('region')}</Text>
                </View>
                <Card style={styles.myCard} onPress={()=>{Linking.openURL('mailto:'+this.props.navigation.getParam('email'))}} >
                    <View style={styles.cardContent}>
                        <Ionicons name="ios-mail" size={32} color="#4c57ed" />
                        <Text style={styles.mytext}>{this.props.navigation.getParam('email')}</Text>
                    </View>
                </Card>
                <Card style={styles.myCard} onPress={this.openDial.bind(this)} >
                    <View style={styles.cardContent}>
                        <Ionicons name="ios-call" size={32} color="#4c57ed" />
                        <Text style={styles.mytext}>{this.props.navigation.getParam('phoneNumber')}</Text>
                    </View>
                </Card>
                <Card style={styles.myCard}>
                    <View style={styles.cardContent}>
                        <Ionicons name="ios-home" size={32} color="#4c57ed" />
                        <Text style={styles.mytext}>{this.props.navigation.getParam('address')}</Text>
                    </View>
                </Card>
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
