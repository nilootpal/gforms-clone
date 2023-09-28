import React, { useEffect, useState, useRef } from 'react'
import { 
    Box, 
    ButtonGroup,
    IconButton,
    Button,
    Icon,
    Input,
    Tab,
    TabPanel,
    TabPanels,
    Tabs,
    TabList,
    Modal,
    ModalBody,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    ModalHeader,
    FormControl,
    useDisclosure,
    InputGroup,
    InputRightElement,
    useToast
  } from '@chakra-ui/react';
import { FaWpforms } from 'react-icons/fa';
import { BiSolidCopy } from 'react-icons/bi';
import { getCurrentUser, isAuthenticated } from '../../services/authService';
import { useParams, useNavigate } from 'react-router-dom';
import { getForm } from '../../services/formService';
import { AiOutlineLogout } from 'react-icons/ai';
import { logout as userLogout } from '../../services/authService';
import QuestionsTab from './QuestionsTab';

const EditForm = (props) => {
    const [user, setUser] = useState({})
    // const [formID, setFormID] = useState('');
    const [formDetails, setFormDetails] = useState({});
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if(isAuthenticated()) setUser(getCurrentUser());
    }, []);

    useEffect(() => {
        let formId = params.formId;
        if(formId){
            // setFormID(formId)
            getForm(formId)
            .then((data) => { 
                console.log(data);     
                setFormDetails(data)       
            })
            .catch((error) => {
                let resMessage = error?.response?.data?.message || error.message || error.toString();
                console.log(resMessage);
            })
        }
    }, [params]);

    const logout =()=>{
        let logoutConfirmation = window.confirm("Really want to logout?");
    
        if(logoutConfirmation){
          userLogout();
          navigate("/login");
        }
      };

  return (
    <Box w='100%' h='100%'>
        {
            formDetails.createdBy === user.id ? (
                <>
                    <Box 
                        p={4}
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'
                        h='8vh'
                        bg='#fff'
                        position='sticky'
                        top={0}
                        zIndex={10}
                    >
                        <Box 
                            display='flex' 
                            flexDir='row' 
                            justifyContent='space-between'
                            alignItems='center' 
                            w='10%'
                        >
                            <Icon 
                                as={FaWpforms} 
                                boxSize={8}
                                color='green.500'
                                cursor={'pointer'}
                                onClick={() => {
                                    navigate('/');
                                }}
                            />
                        </Box>
                        <Box minWidth='200px' display='inline-block'>
                            <Input
                                value={formDetails?.name ? formDetails.name : ''} 
                                onChange={(e) => console.log(e.target.value)}
                                textAlign='center'
                                variant='flushed'
                                placeholder='Untitled'
                            />
                        </Box>
                        <Box>
                            <ButtonGroup gap='4'>
                                <SendFormButton formDetails={formDetails}/>
                                <IconButton 
                                    isRound 
                                    _hover={{ bg: 'green.300' }}
                                    fontSize='24px' 
                                    color='#22543D' 
                                    bg={'green.300'}
                                    icon={<AiOutlineLogout/>} 
                                    onClick={logout}
                                />
                            </ButtonGroup>
                        </Box>
                    </Box>
                    <Box 
                        display='flex'
                        justifyContent='center'
                        alignItems='center'
                    >
                        <Tabs 
                            width='100%'
                            display='flex'
                            flexDir='column'
                            alignItems='center'
                            colorScheme='green'
                        >
                            <TabList 
                                h='5vh' 
                                position='sticky'
                                top='8vh'
                                bg='#fff'
                                width='100%'
                                display='flex'
                                justifyContent='center'
                                zIndex={10}
                            >
                                <Tab>Questions</Tab>
                                <Tab>Response</Tab>
                            </TabList>
                            <TabPanels 
                                w='100vw' 
                                bg='green.100'
                                display='flex'
                                justifyContent='center'
                                minH={'87vh'}
                                h={'100%'}
                            >
                                <TabPanel>
                                    <QuestionsTab formDetails={formDetails}/>
                                </TabPanel>
                                <TabPanel>  
                                    Beta
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Box>
                </>
            ) : (
                <Box
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    bg={'red.100'}
                    color={'red.800'}
                    h={'100vh'}
                    fontSize={'3xl'}
                >
                    You are not the owner of the phone.
                </Box>
            )
        }
        
    </Box>
  )
}

const SendFormButton = ({ formDetails }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = useRef(null);
    const toast = useToast();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.origin + "/s/" + formDetails._id)
        toast({
            title: 'Copied to Clipboard',
            status: 'success',
            duration: 3000,
            position: 'top-right',
            isClosable: true,
          })
    }
  
    return (
      <>
        <Button 
          onClick={onOpen}
          bg={'green.500'}
          color={'white'}
          _hover={{ bg: 'green.600' }}
        >
            Send
        </Button>
        <Modal
          initialFocusRef={initialRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader color={'green.800'}>
              Copy and Share Link
            </ModalHeader>

            <ModalBody pb={6} color={'green.800'}>
              <FormControl>
                <InputGroup>
                    <Input 
                    _focus={{ borderColor: 'green.500' }}
                    _placeholder={{ color: 'green.500' }}
                    ref={initialRef} 
                    placeholder='Form Name' 
                    value = {window.location.origin + "/s/" + formDetails._id}
                    onChange={() => {}}
                    />
                    <InputRightElement>
                        <Icon
                            as={BiSolidCopy}
                            boxSize={6}
                            color='green.800'
                            cursor={'pointer'}
                            onClick={() => copyToClipboard()}
                        />
                    </InputRightElement>
                </InputGroup>
              </FormControl>
            </ModalBody>
  
            <ModalFooter>
              <Button onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }

export default EditForm