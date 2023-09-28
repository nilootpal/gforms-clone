import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  InputGroup,
  Button,
  Text,
  Heading,
  useToast
} from "@chakra-ui/react";
import './login.css';
import { loginWithCredentials, guestCredentials, isAuthenticated } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [userDetail, setUserDetail] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    if(isAuthenticated()){
        navigate('/');
    }
  }, [navigate]);

  const login = async (userDetail) => {
    loginWithCredentials(userDetail)
        .then((res) => {
            navigate('/');
        })
        .catch((e) => {
            setUserDetail({
                name: '',
                email: ''
            });
            toast({
                title: 'Login Error',
                description: "Account not found in the database",
                status: 'error',
                duration: 3000,
                position: 'top-right',
                isClosable: true,
              })
            setIsSignUp(true);
        });
  }

  const toggle = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <Box 
        className={`container ${isSignUp ? 'sign-up' : 'sign-in'}`}
		pos={'relative'}
		minH={'100vh'}
		overflow={'hidden'}
		sx={{
			'::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right:0,
                height: '100vh',
                width: '300vw',
                transform: 'translate(35%, 0)',
                zIndex: 6,
                transition: '1s ease-in-out',
                borderBottomRightRadius: 'max(50vw, 50vh)',
                borderTopLeftRadius: 'max(50vw, 50vh)',
                boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                background: 'var(--chakra-colors-green-400)',
			}
		}}
    >
		<Box 
			display={'flex'}
			flexWrap={'wrap'}
			height={'100vh'}
		>
			<Box 
                w={'50%'}
                className="align-items-center sign-up"
                display={'flex'}
                flexDir={'column'}
                alignItems={'center'}
                justifyContent={'center'}
            >
				<Box 
                    width={'100%'}
                    maxW={'400px'}
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    textAlign={'center'}
                >
					<Box 
                        className="form sign-up"
                        p={3}
                        bg={'white'}
                        borderRadius={'12px'}
                        width={'100%'}
                        boxShadow={'rgba(0, 0, 0, 0.35) 0px 5px 15px'}
                        transform={'scale(0)'}
                        transition={'0.5s ease-in-out'}
                        transitionDelay={'1s'}
                    >
                        <InputGroup 
                            pos={'relative'}
                            w={'100%'}
                            margin={'1vw 0'}
                        >
                            <Input 
                                _focus={{
                                    border: '2px solid var(--chakra-colors-green-300)'
                                }}
                                outline={'none'}
                                bg={'blackAlpha.100'}
                                borderRadius={'5px'}
                                padding={'4px 8px'}
                                placeholder="Username" 
                                onChange={(e) => setUserDetail({...userDetail, name: e.target.value})}
                            />
                        </InputGroup>
						<InputGroup 
                            pos={'relative'}
                            w={'100%'}
                            margin={'1vw 0'}
                        >
                            <Input 
                                _focus={{
                                    border: '2px solid var(--chakra-colors-green-300)',
                                }}
                                outline={'none'}
                                bg={'blackAlpha.100'}
                                borderRadius={'5px'}
                                padding={'4px 8px'}
                                placeholder="Email" 
                                onChange={(e) => setUserDetail({...userDetail, email: e.target.value})}
                            />
                        </InputGroup>
						<Button
                            width={'100%'}
                            p={1}
                            border={'none'}
                            borderRadius={'8px'}
                            bg={'green.600'}
                            color={'white'}
                            fontSize={'18px'}
                            outline={'none'}
                            _hover={{
                                bg:'green.500'
                            }}
                            onClick={() => login(userDetail)}
                        >
							Sign up
						</Button>
                        <Text fontSize='xs' mt={4}>
							Already have an account?
							<Text 
                                as='b' 
                                cursor={'pointer'}
                                onClick={toggle}
                            >
								Sign in here
							</Text>
                        </Text>
					</Box>
				</Box>
			
			</Box>
			<Box 
                w={'50%'}
                className="sign-in"
                display={'flex'}
                flexDir={'column'}
                alignItems={'center'}
                justifyContent={'center'}
            >
				<Box 
                    width={'100%'}
                    maxW={'400px'}
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    textAlign={'center'}
                >
					<Box 
                        className="form sign-in"
                        p={3}
                        bg={'white'}
                        borderRadius={'12px'}
                        width={'100%'}
                        boxShadow={'rgba(0, 0, 0, 0.35) 0px 5px 15px'}
                        transform={'scale(0)'}
                        transition={'0.5s ease-in-out'}
                        transitionDelay={'1s'}
                    >
						<InputGroup 
                            pos={'relative'}
                            w={'100%'}
                            margin={'1vw 0'}
                        >
                            <Input 
                                _focus={{
                                    border: '2px solid var(--chakra-colors-green-300)',
                                }}
                                outline={'none'}
                                bg={'blackAlpha.100'}
                                borderRadius={'5px'}
                                padding={'4px 8px'}
                                placeholder="Email" 
                                onChange={(e) => {
                                    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
                                    const isValidEmail = emailPattern.test(e.target.value);
                                    setIsValid(isValidEmail);
                                    setUserDetail({email: e.target.value, name: ''})
                                }}
                            />
                        </InputGroup>
						<Button 
                            width={'100%'}
                            p={1}
                            border={'none'}
                            borderRadius={'8px'}
                            bg={'green.600'}
                            color={'white'}
                            fontSize={'18px'}
                            outline={'none'}
                            _hover={{
                                bg:'green.500'
                            }}
                            onClick={() => login(userDetail)}
                            isDisabled={!isValid || userDetail.email === ''}
                        >
							Sign in
						</Button>
                        <Text 
                            as='b' 
                            fontSize='xs'
                            cursor={'pointer'}
                            onClick={() => {
                                guestCredentials()
                                navigate('/')
                            }}
                        >
                            Login as Guest User
                        </Text>
                        <Text fontSize='xs' mt={4}>
							Don't have an account?
							<Text 
                                as='b' 
                                cursor={'pointer'}
                                onClick={toggle}
                            >
								Sign up here
							</Text>
                        </Text>
					</Box>
				</Box>
			</Box>
		</Box>
		<Box 
            pos={'absolute'}
            top={0}
            left={0}
            pointerEvents={'none'}
            zIndex={6}
            width={'100vw'}
            display={'flex'}
			flexWrap={'wrap'}
			height={'100vh'}
        >
			<Box 
                w={'50%'}
                display={'flex'}
                flexDir={'column'}
                alignItems={'center'}
                justifyContent={'center'}
            >
				<Box 
                    className="text sign-in"
                    m={3}
                    color={'white'}
                >
                    <Heading 
                        as='h2' 
                        size='3xl'
                        sx={{
                            transition: '1s ease-in-out',
                        }}
                    >
                        Welcome
                    </Heading>
				</Box>
			</Box>
			<Box 
                w={'50%'}
                display={'flex'}
                flexDir={'column'}
                alignItems={'center'}
                justifyContent={'center'}
            >
				<Box 
                    className="text sign-up"
                    m={3}
                    color={'white'}
                >
                    <Heading 
                        as='h2' 
                        size='3xl'
                        sx={{
                            transition: '1s ease-in-out',
                        }}
                    >
                        Join with us
                    </Heading>
				</Box>
			</Box>
		</Box>
	</Box>
  );
}

export default Login;
