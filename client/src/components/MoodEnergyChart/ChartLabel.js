export default function ChartLabel({ position, children }) {
  const styles = {
    top: {
      top: -30,
      left: '50%',
      transform: 'translateX(-50%)',
    },
    bottom: {
      bottom: -30,
      left: '50%',
      transform: 'translateX(-50%)',
    },
    left: {
      top: '50%',
      left: -40,
      transform: 'translateY(-50%)',
    },
    right: {
      top: '50%',
      right: -60,
      transform: 'translateY(-50%)',
    },
  };

  return (
    <div style={{ position: 'absolute', ...styles[position], fontWeight: 'bold' }}>
      {children}
    </div>
  );
}