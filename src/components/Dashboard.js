import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout as userLogout, isAuthenticated } from '../services/authService';
import { createForm as userCreateForm, getForms, deleteForm } from '../services/formService';
import { 
  Box, 
  ButtonGroup,
  IconButton,
  Button,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useDisclosure,
  Textarea,
  useToast,
  Spinner,
  Heading,
  Text
} from '@chakra-ui/react';
import { FaWpforms } from 'react-icons/fa';
import { AiOutlineSearch, AiOutlineLogout, AiFillDelete } from 'react-icons/ai';
import { IoEnterSharp } from 'react-icons/io5';

const Dashboard = () => {
  const [formName, setFormName] = useState('Untitled Form');
  const [formDescription, setFormDescription] = useState({
    formName: '',
    formDesc: ''
  });
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [forms, setForms] = useState([])
  const [loadingForms, setLoadingForms] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if(!isAuthenticated()){
        navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if(isAuthenticated()) setUser(getCurrentUser());
  }, [])

  useEffect(() => {
    if(user.id === undefined){
    } else{
        getForms(user.id)
        .then((forms2) => { 
          console.log(forms2);
          setForms(forms2);
          setLoadingForms(false);
        })
        .catch((e) => {
          toast({
            title: 'Error while retrieving user Forms',
            status: 'error',
            duration: 3000,
            position: 'top-right',
            isClosable: true,
        }) 
          setLoadingForms(false);
        })
    }
  }, [user.id, toast])

  const logout =()=>{
    let logoutConfirmation = window.confirm("Really want to logout?");

    if(logoutConfirmation){
      userLogout();
      navigate("/login");
    }
  };

  const createForm = async () => {
    let data = {
      name : formDescription.formName,
      description: formDescription.formDesc || 'Basic Form Structure',
      createdBy: user.id
    }
    if (data.name !== "") {
      userCreateForm(data)
        .then((result) => { 
          navigate("/form/"+result._id);
        })
        .catch((error) => {
          const resMessage = error?.response?.data?.message || error.message || error.toString();
          console.log(resMessage);
        })
    } 
  }

  return (
    <Box 
      w='100%' 
      h='100%'
      bg={'green.100'}
      display={'flex'}
      flexDir={'column'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Box 
        p={4}
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        w={'100%'}
        h='8vh'
        bg='green.300'
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
            color='green.800'
          />
        </Box>
        <Box minWidth='200px' display='inline-block'>
          <InputGroup>
            <InputLeftElement pointerEvents='none'>
              <Icon 
                as={AiOutlineSearch} 
                boxSize={6}
                color='green.800'
              />
            </InputLeftElement>
            <Input 
              color={'black'}
              placeholder='Untitled' 
              value={formName} 
              onChange={(e) => setFormName(e.target.value)}
              variant='flushed'
            />
          </InputGroup>
        </Box>
        <Box>
          <ButtonGroup gap='4'>
              <CreateFormModal
                formDescription={formDescription}
                setFormDescription={setFormDescription}
                createForm={createForm}
              />
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
        minH={'92vh'}
        w={'75%'}
        bg={'green.100'}
        display={'flex'}
        alignItems={loadingForms ? 'center' : 'flex-start'}
        justifyContent={loadingForms ? 'center' : 'flex-start'}
      >
        {
          loadingForms ? <Spinner size={'xl'}/> : 
          forms.length ? (
            forms.map(({name, description, _id}, idx) => (
              <Box 
                key={_id}
                minW={'200px'}
                h={'200px'}
                m={4}
                p={4}
                borderRadius={'8px'}
                bg={'green.200'}
                display={'flex'}
                flexDir={'column'}
                justifyContent={'space-between'}
                _hover={{ bg: 'green.300' }}
              >
                <Box>
                  <Heading as={'h3'} size={'md'}>
                    {name}
                  </Heading>
                  <Text mt={4}>
                    {description}
                  </Text>
                </Box>
                <Box
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Icon 
                    as={IoEnterSharp} 
                    boxSize={6}
                    color='green.800'
                    cursor={'pointer'}
                    onClick={() => navigate("/form/"+_id)}
                  />
                  <Icon
                    as={AiFillDelete}
                    boxSize={6}
                    color='red.400'
                    cursor={'pointer'}
                    onClick={async () => {
                      deleteForm(_id, user.id)
                        .then((res) => {
                          setForms(forms.filter((form) => form._id !== _id))
                        })
                        .catch((e) => {
                          toast({
                            title: e?.response?.data?.message || e.message || e.toString(),
                            status: 'error',
                            duration: 3000,
                            position: 'top-right',
                            isClosable: true,
                          })
                        })
                    }}
                  />
                </Box>
              </Box>
            ))
          ) : (
            <Box 
              fontSize={'3xl'} 
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              h={'92vh'}
              w={'100%'}
            >
              You have no forms yet. Create one now!
            </Box>
          )
        }
      </Box>
    </Box>
  );
}

const CreateFormModal = ({ formDescription, setFormDescription, createForm }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);

  return (
    <>
      <Button 
        onClick={onOpen}
        bg={'green.500'}
        color={'white'}
        _hover={{ bg: 'green.600' }}
      >
        Create Form
      </Button>
      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color={'green.800'}>
            Create a Form
          </ModalHeader>
          <ModalBody color={'green.800'}>
            Add a title and description for your form here.
          </ModalBody>
          <ModalCloseButton />
          <ModalBody pb={6} color={'green.800'}>
            <FormControl>
              <FormLabel>Form Name*</FormLabel>
              <Input 
                _focus={{ borderColor: 'green.500' }}
                _placeholder={{ color: 'green.500' }}
                ref={initialRef} 
                placeholder='Form Name' 
                onChange={(e) => setFormDescription({...formDescription, formName: e.target.value})}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Form Description</FormLabel>
              <Textarea 
                _focus={{ borderColor: 'green.500' }}
                _placeholder={{ color: 'green.500' }}
                placeholder='Form Description' 
                resize={'none'}
                onChange={(e) => setFormDescription({...formDescription, formDesc: e.target.value})}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button 
              bg={'green.500'}
              color={'white'}
              _hover={{ bg: 'green.600' }}
              mr={3}
              isDisabled={formDescription.formName === ''}
              onClick={createForm}
            >
              Save
            </Button>
            <Button 
              onClick={onClose}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Dashboard;
