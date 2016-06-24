import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';

import Button from 'react-native-button';
import axios from 'axios';

const IMP_KEY = '3372420065794528';
const IMP_SECRET = 'YwZIGQT4cEjESlJwSwrk4HadQE2QN4qLBpuhgnms2F7V1QrTmSdrAnEq2HhPLHBm76Enu0PwFXrGNTAa';
const MERCHANT_UID = 'nictest14m';

/*----------------------------------------------------------------
  Structure
  Header: Your Wish List
  Body: Bidding Info
  Footer: <Are you sure?> <No, I'm not sure!> buttons
 ----------------------------------------------------------------*/
class GetLatestBidInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      card_number: 'XXXX-XXXX-XXXX-XXXX',
      expiry: 'YYYY-MM',
      birth: 'YYMMDD',
      pwd_2digit: 'XX',
    }
  }

  _convertDate(date) {
    var newDate;
    var d = date.split("/");
    var y = d.splice(-1)[0];

    d.splice(0, 0, y);
    newDate = d.join("-");

    return newDate;
  }

  bidInfo = {
    checkIn_Date: this._convertDate(this.props.searchData.checkIn_Date),
    checkOut_Date: this._convertDate(this.props.searchData.checkOut_Date),
    mainArea_Name: this.props.searchData.mainArea_Name,
    subArea_Name: this.props.bidData.subArea_Name,
    bid_Price: +this.props.bidData.bid_Price,
  }

  client_Email = this.props.signinData.client_Email

  async _handlePress(where) {

    switch (where) {
    case 'thanks':
      let token;
      try {
        token = (await axios.post('https://api.iamport.kr/users/getToken', {
          'imp_key': IMP_KEY,
          'imp_secret': IMP_SECRET,
        })).data.response.access_token
      } catch (error) {
        console.error('token err: ', error);
      }

      let resp;
      try {
        resp = (await axios.post('https://api.iamport.kr/subscribe/payments/onetime?_token=' + token, {
          merchant_uid: MERCHANT_UID,
          amount: this.bidInfo.bid_Price,
          card_number: this.state.card_number,
          expiry: this.state.expiry,
          birth: this.state.birth,
          pwd_2digit: this.state.pwd_2digit,
        })).data.response;
      } catch (error) {
        console.error('payment err: ', error);
      }

      //console.log(this.bidInfo, this.client_Email, resp);
      axios({
        url: 'http://192.168.1.42:4444/client/bid/' + this.client_Email,
        method: 'put',
        data: {
          checkIn_Date: this.bidInfo.checkIn_Date,
          checkOut_Date: this.bidInfo.checkOut_Date,
          mainArea_Name: this.bidInfo.mainArea_Name,
          subArea_Name: this.bidInfo.subArea_Name,
          bid_Price: this.bidInfo.bid_Price,
          imp_uid: resp.imp_uid,
        }
      }).then(function(response) {
        console.log(response);
        this.props.navigator.push({id: 'thanks'});
      }).catch(function(error) {
        console.log('client bid: ', error);
      });

      break;
    case 'search':
      this.props.navigator.push({id: 'search'});
      // back to bid page
      break;
    }
  }


  onValueChange(key: string, value: string) {
    const newState = {};
    newState[key] = value;
    this.setState(newState);
  }


  render() {
    return (
      <View style={{flex: 1}}>
        <Text style={styles.appName}>
          Your Wish List
        </Text>

        <View style={styles.smallRowContainer}>
          <Text>


            {'-  '} 고객 이메일: {client_Email}
          </Text>
        </View>

        <View style={styles.smallRowContainer}>
          <Text>
            {'-  '} 희망 지역: {this.bidInfo.mainArea_Name + '  ' + this.bidInfo.subArea_Name}
          </Text>
        </View>

        <View style={styles.smallRowContainer}>
          <Text>
            {'-  '} 체크인 날짜: {' ' + this.bidInfo.checkIn_Date}
          </Text>
        </View>

        <View style={styles.smallRowContainer}>
          <Text>
            {'-  '} 체크아웃 날짜: {' ' + this.bidInfo.checkOut_Date}
          </Text>
        </View>

        <View style={styles.smallRowContainer}>
          <Text>
            {'-  '} 희망 가격: {' ' + this.bidInfo.bid_Price}
          </Text>
        </View>

        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.onValueChange('card_number', text)}
          placeholder={this.state.card_number}
        />

        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.onValueChange('expiry', text)}
          placeholder={this.state.expiry}
        />

        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.onValueChange('birth', text)}
          placeholder={this.state.birth}
        />

        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.onValueChange('pwd_2digit', text)}
          placeholder={this.state.pwd_2digit}
        />

        <View style={styles.rowContainer}>
          <Button style={styles.searchBtnText}
            containerStyle={styles.searchBtn}
            onPress={() => this._handlePress('thanks')}>
            I'm SURE!
          </Button>
        </View>

        <View style={styles.rowContainer}>
          <Button style={styles.searchBtnText}
            containerStyle={styles.searchBtn}
            onPress={() => this._handlePress('search')}>
            I'm not SURE!
          </Button>
        </View>

      </View>

    );
  }
}


const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  smallRowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: 30,
    marginTop: 2,
    marginBottom: 2
  },
  appName: {
    fontSize: 20,
    textAlign: 'center',
    color: '#000',
    margin: 10,
  },
  label: {
    width: 60,
    textAlign: 'left',
    margin: 10,
    color: 'black',
  },
  searchBtn: {
    width: 150,
    padding:10,
    height: 30,
    overflow: 'hidden',
    borderColor: 'black',
    borderWidth: 2,
    borderStyle: 'solid',
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBtnText: {
    fontSize: 15,
    color: 'white',
  },
  list: {
    flex: 1,
    padding: 30,
    backgroundColor: 'rgb(39, 174, 96)'
  },
  row: {
    margin: 8,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 20,
    color: 'white'
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1
  }
});

export default GetLatestBidInfo;
