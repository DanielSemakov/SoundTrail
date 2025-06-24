import React from 'react';
import styles from './MoodEnergyChart.module.css';

/**
 * Ensures the Recharts ResponsiveContainer has a fixed height/width.
 */
export default function MoodEnergyChartWrapper({ children }) {
  return <div className={styles.wrapper}>{children}</div>;
}
