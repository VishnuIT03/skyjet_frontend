// import React from 'react';
// import { PDFViewer, Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

// const styles = StyleSheet.create({
//   page: {
//     flexDirection: 'row',
//     backgroundColor: 'white',
//   },
//   section: {
//     margin: 10,
//     padding: 10,
//     flexGrow: 1,
//   },
//   heading: {
//     fontSize: 16,
//     marginBottom: 10,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     color:'red', 
//     justifyContent:'center'
//   },
//   table: {
//     display: 'table',
//     width: '100%',
//   },
//   tableRow: {
//     flexDirection: 'row',
//     borderBottomColor: 'black',
//     borderBottomWidth: 1,
//     alignItems: 'center',
//   },
//   tableHeader: {
//     flexGrow: 1,
//     padding: 8,
//     fontWeight: 'bold',
//     fontSize: 12,
//     backgroundColor: 'dodgerblue',
//     color: 'white',
//     textAlign: 'center', // Center-align the headers
//   },

//   tableCell: {
//     flexGrow: 1,
//     padding: 8,
//     fontWeight: 'bold',
//     fontSize: 12,
//     textAlign: 'center', // Center-align the headers
//   },
 
// });

// const PDFGenerator = ({ activity, schedule }) => {


    
//   return (
    
//     <PDFViewer style={{ width: '100%', height: '600px' }}>
//       <Document>
//         <Page size="A4" style={styles.page}>
//           <View style={styles.section}>
//             <Text style={styles.heading}>SkyJetBookings Receipt</Text>
//             <View style={styles.table}>
//               <View style={styles.tableRow}>
//                 <Text style={styles.tableHeader}>Details</Text>
//                 <Text style={styles.tableHeader}>Information</Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.tableCell}>First Name:</Text>
//                 <Text style={styles.tableCell}>{activity.firstname}</Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.tableCell}>Last Name:</Text>
//                 <Text style={styles.tableCell}>{activity.lastname}</Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.tableCell}>Phone:</Text>
//                 <Text style={styles.tableCell}>{activity.phone}</Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.tableCell}>Age:</Text>
//                 <Text style={styles.tableCell}>{activity.age} years old</Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.tableCell}>Gender:</Text>
//                 <Text style={styles.tableCell}>{activity.gender}</Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.tableCell}>Nationality:</Text>
//                 <Text style={styles.tableCell}>{activity.nationality}</Text>
//               </View>
//             </View>
//           </View>
//           <View style={styles.section}>
//             <View style={styles.table}>
//               <View style={styles.tableRow}>
//                 <Text style={styles.tableHeader}>Booking Details</Text>
//                 <Text style={styles.tableHeader}>Information</Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.tableCell}>Class:</Text>
//                 <Text style={styles.tableCell}>{activity.class}</Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.tableCell}>Fare:</Text>
//                 <Text style={styles.tableCell}>Rs {schedule.seats[activity.classType === 'Economy' ? 0 : 1].fare} /-</Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.tableCell}>Seat Number:</Text>
//                 <Text style={styles.tableCell}>{activity.seatNumber}</Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.tableCell}>Booked Date:</Text>
//                 <Text style={styles.tableCell}>{activity.createdAt.slice(0, 10)}</Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.tableCell}>Booked Time:</Text>
//                 <Text style={styles.tableCell}>{activity.createdAt.slice(11, 16)}</Text>
//               </View>
//             </View>
//           </View>
//         </Page>
//       </Document>
//     </PDFViewer>
//   );
// };

// export default PDFGenerator;



import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { PDFViewer, Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import '../styles/pdfgen.css';
const PDFGenerator = ({activity,schedule}) => {


    const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  heading: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color:'red', 
    justifyContent:'center'
  },
  table: {
    display: 'table',
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  tableHeader: {
    flexGrow: 1,
    padding: 8,
    fontWeight: 'bold',
    fontSize: 12,
    backgroundColor: 'dodgerblue',
    color: 'white',
    textAlign: 'center', // Center-align the headers
  },

  tableCell: {
    flexGrow: 1,
    padding: 8,
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center', // Center-align the headers
  },
 
});

  const handleGeneratePDF = () => {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    doc.text('SkyJetBookings Receipt', 10, 10);

    // Define your content in tabular format using jspdf-autotable
    const tableData = [
        ['Details', 'Information'],
        ['First Name:', activity.firstname],
        ['Last Name:', activity.lastname],
        ['Phone:', activity.phone],
        ['Age:', `${activity.age} years old`],
        ['Gender:', activity.gender],
        ['Nationality:', activity.nationality],
        ['Class:', activity.class],
        ['Fare:', `Rs ${schedule.seats[activity.class === 'Economy' ? 0 : 1].fare} /-`],
        ['Seat Number:', activity.seatNumber],
        ['Booked Date:', activity.createdAt.slice(0, 10)],
        ['Booked Time:', activity.createdAt.slice(11, 16)],
      ];
      
    doc.autoTable({
        startY: 20,
        head: [['Details', 'Information']],
        body: tableData,
      });
  // Add more content as needed

    // Save the PDF as a blob
    doc.save('receipt.pdf', { returnPromise: true }).then((blob) => {
      // Use FileSaver to trigger the download
      saveAs(blob, 'receipt.pdf');
    });
  };

  return (
    <div>
      <button className='download-button' onClick={handleGeneratePDF}>Download PDF</button>
    </div>
  );
};

export default PDFGenerator;
