// import React from 'react';
// import {
//   Box, 
//   Grid, 
//   Text, 
//   Image, 
//   Radio, 
//   RadioGroup, 
//   Button, 
//   Divider, 
//   useColorModeValue,
//   IconButton,
//   Heading
// } from '@chakra-ui/react';
// import { FaBars } from 'react-icons/fa';
// import { useParams } from 'react-router-dom';

// // Remove any Material-UI imports...

// function UserView(props) {
//   // ... existing logic ...
//   const [userId, setUserId] = React.useState("")
//     const [formData, setFormData] = React.useState({});
//     const [responseData, setResponseData] = React.useState([])
//     //console.log(responseData);
    
//     const [optionValue, setOptionValue] = React.useState([])
//     const [isSubmitted, setIsSubmitted] = React.useState(false)
    
    
//     const [questions, setQuestions] = React.useState([]);
//     const [value, setValue] = React.useState('');
//     //console.log(value);
//     React.useEffect(()=>{
//       if(auth.isAuthenticated()){
//         var userr = auth.getCurrentUser();
//         console.log(userr.id);
//         setUserId(userr.id);  
//       } else{
//         var anonymousUserId = "anonymous" +  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
//         console.log(anonymousUserId);
//         setUserId(anonymousUserId)
//       }
//     }, [])
    
    

//     const handleRadioChange = (j, i) => {
//       var questionId = questions[i]._id
//       var optionId = questions[i].options[j]._id

//       var fakeData = {
//         question: i,
//         option: j
//       }
//       var data = {
//         questionId, optionId
//       }
//     //  console.log(data);
//       //console.log(fakeData);
//      // console.log(j);
      
//       setValue(j)

//       var fakeRData = [...responseData];
      
//       var indexOfResponse = fakeRData.findIndex(x => x.questionId===questionId);
//         if(indexOfResponse === -1){
//         setResponseData(responseData=> [...responseData, data])

//         } else{
//           fakeRData[indexOfResponse].questionId = questionId
//           setResponseData(fakeRData);
//         }

      
//      // setOptionValue(fakeData);
//     //  
//     };

//     React.useEffect(() => {
//         var formId = props.match.params.formId
//         console.log(formId);

//         formService.getForm(formId)
//         .then((data) => { 
//             console.log(data);
            
//             setFormData(data)      
//             setQuestions(data.questions) 
//            },
//            error => {
//            const resMessage =
//                (error.response &&
//                error.response.data &&
//                error.response.data.message) ||
//                error.message ||
//                error.toString();
//                console.log(resMessage);
//            }
//        );
        
//     },[props.match.params.formId]);

//   const { formId } = useParams();

//   // ... existing logic ...

//   return (
//     <Box minHeight="100vh">
//       <Box bgColor={useColorModeValue('gray.100', 'gray.900')} p={4}>
//         <Grid templateColumns="repeat(2, 1fr)" gap={6}>
//           <IconButton aria-label="Menu" icon={<FaBars />} />
//           <Heading as="h6" size="md">
//             Velocity Forms
//           </Heading>
//         </Grid>
//       </Box>

//       <Grid templateColumns="repeat(2, 1fr)" gap={6}>
//         <Box w="100%" p={4} rounded="md" boxShadow="lg">
//           <Heading as="h4" size="lg">{formData.name}</Heading>
//           <Text>{formData.description}</Text>
//         </Box>

//         {/* Other components go here... use Box for Paper, Text for Typography, etc. */}

//         {!isSubmitted ? (
//           <Box>
//             {questions.map((ques, i) => (
//               <Box key={i} p={4} rounded="md" boxShadow="lg">
//                 {/* Question components */}
//               </Box>
//             ))}
//             <Button colorScheme="blue" onClick={submitResponse}>
//               Submit
//             </Button>
//           </Box>
//         ) : (
//           <Box>
//             <Text>Form submitted</Text>
//             <Text>Thanks for submitting the form</Text>
//             <Button onClick={reloadForAnotherResponse}>Submit another response</Button>
//           </Box>
//         )}
//       </Grid>
//     </Box>
//   )
// }

// export default UserView;
