import React,{Component} from 'react';
import {View,Text} from 'react-native';


//export default class StockScreen extends React.Component {
//  render() {
//    return (
//        <View >
//          <Text>Current Stock Screen</Text>
//        </View>
//    );
//  }
//}

export default class Table extends Component {
    renderRow() {
        return (
            <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row' }}>
                {/*Edit these as they are your cells. You may even take parameters to display different data / react elements etc.*/}
                <View style={{ flex: 1, alignSelf: 'stretch' }} />
                <View style={{ flex: 1, alignSelf: 'stretch' }} />
                <View style={{ flex: 1, alignSelf: 'stretch' }} />
                <View style={{ flex: 1, alignSelf: 'stretch' }} />
                <View style={{ flex: 1, alignSelf: 'stretch' }} />
            </View>
        );
    }

    render() {
        const data = [1, 2, 3, 4, 5];
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {
                data.map((datum) => { // This will render a row for each data element.
                    return this.renderRow();
                })
            }
            </View>
        );
    }
}