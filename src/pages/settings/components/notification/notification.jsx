import React,{useState, useEffect} from 'react';
import { connect} from 'react-redux';
import {useTranslation } from 'react-i18next';
import {useHistory} from 'react-router-dom';
import {Button} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
const Notification = props => {
    return(
        <div>
            <p>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa </p>
        </div>
    )
}

const mapStateToProps = (state) => ({
    accountData:state.notification?state.notification:null
});
export default connect(mapStateToProps)(Notification);