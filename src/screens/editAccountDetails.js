import React, {Component, useState} from 'react';
import { StyleSheet, View, Text, Modal, Alert} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import {connect} from 'react-redux';
import {updateUser} from "../Utils";

class editAccountDetails extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        firstName: this.props.user.firstName,
        lastName: this.props.user.lastName,
        address: this.props.user.address,
        phoneNumber: this.props.user.phoneNumber,
        picture: "",
        modal: false
      }
    }

        pickFromGallery = async () => {
            const {granted} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if (granted){
                let data = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing:true,
                    aspect:[1,1],
                    quality:0.5
                })
                if(!data.cancelled){
                    let newfile={
                        uri:data.uri,
                        type:`test/${data.uri.split(".")[1]}`,
                        name:`test.${data.uri.split(".")[1]}`
                    }
                    this.handleUpload(newfile)
                }
            }else{
                Alert.alert("You need to give permission to access the Gallery")
            }
        }

        pickFromCamera = async () => {
            const {granted} = await Permissions.askAsync(Permissions.CAMERA)
            if (granted){
                let data = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing:true,
                    aspect:[1,1],
                    quality:0.5
                })
                if(!data.cancelled){
                    let newfile={
                        uri:data.uri,
                        type:`test/${data.uri.split(".")[1]}`,
                        name:`test.${data.uri.split(".")[1]}`
                    }
                    this.handleUpload(newfile)
                }
            }else{
                Alert.alert("You need to give permission to access the Camera")
            }
        }

        handleUpload = (image)=>{
            const data = new FormData()
            data.append('file',image)
            data.append('upload_preset','employeeApp')
            data.append("cloud_name","cloudshashini")

            fetch("https://api.cloudinary.com/v1_1/cloudshashini/image/upload",{
                method:"post",
                body:data
            }).then(res=>res.json()).
            then(data=>{
                console.log(data)
                this.setPicture(data.url)
                this.setModalFalse()
            })
        }

        setFirstName=(text)=>{
            this.setState({firstName:text});
        }
        setLastName=(text)=>{
            this.setState({lastName:text});
        }
        setAddress=(text)=>{
            this.setState({address:text});
        }
        setPhone=(text)=>{
            this.setState({phoneNumber:text});
        }
        setPicture=(text)=>{
            this.setState({picture:text});
        }
        setModalTrue=()=>{
            this.setState({modal:true});
        }
        setModalFalse=()=>{
            this.setState({modal:false});
        }

    render(){
        return (
            <View style={styles.root}>
                <TextInput
                    label='First Name'
                    style={styles.inputStyle}
                    value={this.state.firstName}
                    placeholder={this.props.user.firstName}
                    theme={theme}
                    mode="outlined"
                    onChangeText ={(text)=>{this.setFirstName(text)}}
                />
                <TextInput
                    label='Last Name'
                    style={styles.inputStyle}
                    value={this.state.lastName}
                    placeholder={this.props.user.lastName}
                    theme={theme}
                    mode="outlined"
                    onChangeText={(text)=>{this.setLastName(text)}}
                />
                <TextInput
                    label='Home Address'
                    style={styles.inputStyle}
                    value={this.state.address}
                    placeholder={this.props.user.address}
                    theme={theme}
                    mode="outlined"
                    onChangeText={(text)=>{this.setAddress(text)}}
                />
                <TextInput
                    label='Phone Number'
                    style={styles.inputStyle}
                    value={this.state.phoneNumber}
                    placeholder={this.props.user.phoneNumber}
                    theme={theme}
                    keyboardType= "number-pad"
                    mode="outlined"
                    onChangeText={(text)=>{this.setPhone(text)}}
                />
                <Button style={styles.inputStyle} icon={this.state.picture==""?"upload":"check"} mode="contained" theme={theme} onPress={() => this.setModalTrue()}>
                    Upload Image
                </Button>
                <Button style={styles.inputStyle} icon="content-save" mode="contained" theme={theme} onPress={() =>updateUser (this.props.user.uid, this.state.firstName, this.state.lastName, this.state.address, this.state.phoneNumber)}>
                    Save
                </Button>
                <Modal animationType="slide" transparent={true} visible={this.state.modal} onRequestClose={() => this.setModalFalse()}>
                    <View style={styles.modalView}>
                        <View style={styles.modalButtonView}>
                            <Button icon="camera" theme={theme} mode="contained" onPress={() => this.pickFromCamera()}>
                                Camera
                            </Button>
                            <Button icon="image-area" theme={theme} mode="contained" onPress={() => this.pickFromGallery()}>
                                Gallery
                            </Button>
                        </View>
                        <Button theme={theme} onPress={() => this.setModalFalse()}>
                            Cancel
                        </Button>
                    </View>
                </Modal>
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
        flex:1,
        backgroundColor: '#e0e0e0'
    },
    inputStyle:{
        margin:5
    },
    modalView: {
        position:"absolute",
        bottom:2,
        width:"100%",
        backgroundColor: "white"
    },
    modalButtonView:{
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    }
});

const mapStateToProps = (state) => ({
  user: state.AuthenticationReducer.user,
});

const bindAction = (dispatch) => ({

});

export default connect(
  mapStateToProps,
  bindAction
)(editAccountDetails);