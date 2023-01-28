import React from 'react'
import Nav from './mainLoginFol/Nav'
import styles from '../../CSS/loginCss/mainlogin.module.css'
import CallToAction from './mainLoginFol/CallToAction'
import Footer from './Footer'
function MainLogin() {
	return (
		<div className={styles.mainLogin}>
			<Nav />
			<CallToAction />
			<Footer />
		</div>
	)
}

export default MainLogin
