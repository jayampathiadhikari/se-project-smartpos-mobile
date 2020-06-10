import React, {Component} from 'react';
import { StyleSheet, View, Image, Text, Linking, Platform, ScrollView, SafeAreaView, FlatList } from 'react-native';
import {Title, Card, Button} from 'react-native-paper';
import * as Permissions from 'expo-permissions';
import {LinearGradient} from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from "react-redux";
import storage from '@react-native-firebase/storage';

class myAccountScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            picture: ""
        }
    }

    async componentDidMount() {
        const url = await storage()
            .ref('images/'+this.props.user.email)
            .getDownloadURL()
            .then(url => {this.setState({picture: url});})
            .catch(e=>{console.log(e);});
    }

    openDial () {
        if(Platform.OS === "android"){
            Linking.openURL('tel:'+this.props.user.phoneNumber)
        }else{
            Linking.openURL('telprompt:'+this.props.user.phoneNumber)
        }
    }

    static navigationOptions = ({navigation}) => {
        // const{ params} = navigation.state;
        return {
          title: 'My Account',
        };
      };

    render () {
        let image;
        if (this.state.picture == "") {
            image = <Image style={styles.image} source={require('../assets/default-profile.jpg')}/>;
        } else {
            image = <Image style={styles.image} source={{ uri: this.state.picture }}/>;
        }
        return (
            <SafeAreaView style={styles.root}>
                <ScrollView>
                    <View style={styles.imageContainer}>
                        {image}
                    </View>
                    <View style={{alignItems:"center"}}>
                        <Title>{this.props.user.firstName} {this.props.user.lastName}</Title>
                        <Text style={{fontSize:18}}>{this.props.user.region}</Text>
                    </View>
                    <Card style={styles.myCard} onPress={()=>{Linking.openURL('mailto:'+this.props.user.email)}} >
                        <View style={styles.cardContent}>
                            <Ionicons name="ios-mail" size={32} color="#4c57ed" />
                            <Text style={styles.mytext}>{this.props.user.email}</Text>
                        </View>
                    </Card>
                    <Card style={styles.myCard} onPress={this.openDial.bind(this)} >
                        <View style={styles.cardContent}>
                            <Ionicons name="ios-call" size={32} color="#4c57ed" />
                            <Text style={styles.mytext}>{this.props.user.phoneNumber}</Text>
                        </View>
                    </Card>
                    <Card style={styles.myCard}>
                        <View style={styles.cardContent}>
                            <Ionicons name="ios-home" size={32} color="#4c57ed" />
                            <Text style={styles.mytext}>{this.props.user.address}</Text>
                        </View>
                    </Card>
                    <View style={{flexDirection:"row", justifyContent:"space-around", padding:10}}>
                        <Button icon="account-edit" mode="contained" theme={theme} onPress={() => this.props.navigation.navigate("EditAccount")}>
                            Edit Profile
                        </Button>
                    </View>
                </ScrollView>
            </SafeAreaView>
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
)(myAccountScreen);

const theme = {
    colors:{
        primary:"#4c57ed"
    }
}

const styles = StyleSheet.create({
    root:{
        flex:1,
        backgroundColor: '#e4e5f7'
    },
    image:{
        width:140,
        height:140,
        borderRadius:70
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
