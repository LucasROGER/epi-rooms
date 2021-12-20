import React from 'react';
import styles from '../styles/Caption.module.css'

export const Caption = ({color, text}) => {
  return (
    <div style={{display: "flex", alignItems: "center"}}>
      <div className={styles.caption} style={{backgroundColor: color, marginLeft: 50}}>&nbsp;</div>
      <p style={{marginLeft: 10, fontWeight: "bold", fontSize: 20, color: 'white'}}>{text}</p>
    </div>
  )
};
