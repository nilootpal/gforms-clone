import React, { useEffect, useState } from 'react';
import { 
    Accordion,
    AccordionButton,
    AccordionItem,
    AccordionPanel,
    Box, 
    Button, 
    Heading, 
    Input, 
    Radio, 
    RadioGroup, 
    Stack, 
    Text,
    useToast,
    Icon
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { autoSave } from '../../services/formService';
import { AiOutlineClose } from 'react-icons/ai';
import { BiSolidImageAdd } from 'react-icons/bi';
import { v4 as uuidv4 } from 'uuid';

const QuestionsTab = ({ formDetails }) => {
    const params = useParams();
    const [questions, setQuestions] = useState(formDetails.questions || []);
    const [openIndex, setOpenIndex] = useState(-1);
    const toast = useToast();

    const addMoreQuestionField = () => {
        setQuestions(question => [
            ...question, 
            {
                questionId: `${uuidv4()}`, 
                questionText: `Question-${question.length+1}`, 
                options : [
                    { optionText: "Option 1" }
                ], 
                open: true, 
                isRequired: false
            }
        ]);
    }

    const removeOption = (i, j) => {
        let optionsOfQuestion = [...questions];
        if(optionsOfQuestion[i].options.length > 1){
          optionsOfQuestion[i].options.splice(j, 1);
          setQuestions(optionsOfQuestion);
        } else {
            toast({
                title: 'Every question should have atleast one option',
                status: 'error',
                duration: 3000,
                position: 'top-right',
                isClosable: true,
            }) 
        }
    }

    const deleteQuestion = (i) => {
        let qs = [...questions]; 
        if(questions.length > 0)
            qs.splice(i, 1);
        setQuestions(qs)
    }

    const addOption = (i) => {
        let optionsOfQuestion = [...questions];
        if(optionsOfQuestion[i].options.length < 5){
          optionsOfQuestion[i].options.push({
            optionText: "Option " + (optionsOfQuestion[i].options.length + 1)
        })
        } else{
            toast({
                title: 'Max 5 options is possible for one question',
                status: 'error',
                duration: 3000,
                position: 'top-right',
                isClosable: true,
            }) 
        }
        setQuestions(optionsOfQuestion)
      }

    const saveQuestions = async () => {
        console.log("Auto saving questions initiated");
        let data = {
          formId: params.formId,
          name: formDetails.name,
          description: formDetails.description,
          questions: questions
        }
    
        autoSave(data)
        .then((result) => {     
            setQuestions(result.questions);
            toast({
                title: 'Successfully saved the form',
                status: 'success',
                duration: 3000,
                position: 'top-right',
                isClosable: true,
            })
        })
        .catch(error => {
            const resMessage = error?.response?.data?.message || error.message || error.toString();
            console.log(resMessage);
        });
        
      }

    const onDragEnd = (result) => {
        if(!result.destination) return;
        const { destination, source } = result;

        if(!destination) return;
        if(destination.droppableId === source.droppableId && destination.index === source.index) return;

        setQuestions(question => {
            let result = question;
            const [ removed ] = result.splice(source.index, 1);
            result.splice(destination.index, 0, removed);
            return result;
        })
        setOpenIndex(destination.index);
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Box
                mt={'15px'}
                mb={'7px'}
                pb={'30px'}
                display={'flex'}
                justifyContent={'center'}
                flexDir={'column'}
                alignItems={'center'}
                w={'100vw'}
            >
                <Box
                    borderTop={'5px solid teal'}
                    borderRadius={10}
                    width={'50%'}
                    display={'flex'}
                    flexDirection={'column'}
                    alignItems={'flex-start'}
                    p={'20px 24px'}
                    bg={'#fff'}
                >   
                    <Heading 
                        as='h3' 
                        size='lg'
                        color={'green.700'}
                        mb={'15px'}
                    >
                        {formDetails.name}
                    </Heading>
                    <Text fontSize='xl'>
                        {formDetails.description}
                    </Text>
                </Box>
                <StrictModeDroppable droppableId={params.formId}>
                    {(provided) => (
                        <Accordion
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            width={'50%'}
                            index={openIndex}
                        >
                            {
                                questions.map(({ questionId, questionText, options, open }, idxQ) => (
                                    <Draggable 
                                        key={questionId}
                                        draggableId={questionId}
                                        index={idxQ}
                                    >
                                        {(provided) => (
                                            <AccordionItem
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                ref={provided.innerRef}
                                                bg={'#fff'}
                                                mt={'15px'}
                                                mb={'7px'}
                                                p={'18px 24px'}
                                                borderRadius={'5px'}
                                                _hover={{bg: 'gray.100'}}
                                                onClick={() => setOpenIndex(idxQ)}
                                                height={'fit-content'}
                                            >
                                                <AccordionButton
                                                    _hover={{bg: 'transparent'}}
                                                    display={'flex'}
                                                    flexDir={'column'}
                                                    alignItems={'flex-start'}
                                                    justifyContent={'space-between'}
                                                    zIndex={0}
                                                >
                                                    {/* <Heading as='h3' size='md'>
                                                        {questionText}
                                                    </Heading> */}
                                                    <Box
                                                        display='flex'
                                                        justifyContent='space-between'
                                                        alignItems={'center'}
                                                        width={'100%'}
                                                    >
                                                        <Input
                                                            w={'100%'}
                                                            variant='unstyled'
                                                            borderRadius='0'
                                                            _focus={{
                                                                borderBottom: '2px solid var(--chakra-colors-green-500)'
                                                            }}
                                                            onChange={(e) => console.log(e.target.value)}
                                                            value={questionText}
                                                            size={'lg'}
                                                            fontWeight={'bold'}
                                                        />
                                                        <Icon 
                                                            as={BiSolidImageAdd} 
                                                            boxSize={6}
                                                            color='blackAlpha.200'
                                                            _hover={{color: 'blackAlpha.700'}}
                                                            cursor={'pointer'}
                                                        />
                                                    </Box>
                                                    <RadioGroup mt={6} width={'100%'}>
                                                        <Stack 
                                                            direction='column' 
                                                            spacing={2}
                                                            width={'100%'}
                                                        >
                                                            {
                                                                options.map(({ optionText }, idx) => (
                                                                    <Box 
                                                                        key={idx}
                                                                        display='flex'
                                                                        justifyContent='space-between'
                                                                        alignItems={'center'}
                                                                        width={'100%'}
                                                                    >
                                                                        <Radio value={optionText} />
                                                                        <Input
                                                                            w={'100%'}
                                                                            ml={5}
                                                                            variant='unstyled'
                                                                            borderRadius='0'
                                                                            _focus={{
                                                                                borderBottom: '2px solid var(--chakra-colors-green-500)'
                                                                            }}
                                                                            onChange={(e) => console.log(e.target.value)}
                                                                            placeholder={`Option ${idx+1}`}
                                                                            value={optionText}
                                                                        />
                                                                        <Icon 
                                                                            as={BiSolidImageAdd} 
                                                                            boxSize={6}
                                                                            color='blackAlpha.200'
                                                                            _hover={{color: 'blackAlpha.700'}}
                                                                            cursor={'pointer'}
                                                                        />
                                                                        <Icon 
                                                                            as={AiOutlineClose} 
                                                                            boxSize={6}
                                                                            color='blackAlpha.200'
                                                                            _hover={{color: 'blackAlpha.700'}}
                                                                            cursor={'pointer'}
                                                                            onClick={() => removeOption(idxQ, idx)}
                                                                        />
                                                                    </Box>
                                                                ))
                                                            }   
                                                        </Stack>
                                                    </RadioGroup>
                                                </AccordionButton>
                                                <AccordionPanel 
                                                    pb={4}
                                                    display={'flex'}
                                                    flexDir={'row'}
                                                    alignItems={'flex-start'}
                                                    justifyContent={'space-between'}
                                                    zIndex={10}
                                                >   
                                                    <Button
                                                        variant={'solid'}
                                                        bg={'green.200'}
                                                        _hover={{ bg: 'green.300' }}
                                                        color={'#fff'}
                                                        cursor={'pointer'}
                                                        onClick={() => addOption(idxQ)}
                                                    >
                                                        Add options
                                                    </Button>
                                                    <Button
                                                        variant={'solid'}
                                                        bg={'green.200'}
                                                        _hover={{ bg: 'green.300' }}
                                                        color={'#fff'}
                                                        cursor={'pointer'}
                                                        onClick={() => deleteQuestion(idxQ)}
                                                    >
                                                        Delete Question
                                                    </Button>
                                                    
                                                    {/* Write something */}
                                                </AccordionPanel>
                                            </AccordionItem>
                                        )}
                                    </Draggable>
                                ))
                            }
                            {provided.placeholder}
                        </Accordion>
                    )}
                </StrictModeDroppable>
                <Stack 
                    direction='row' 
                    w={'50%'} 
                    align={'center'}
                    p={'12px 12px'}
                    display={'flex'}
                    flexDirection={'row-reverse'}
                >
                    <Button
                        variant={'solid'}
                        bg={'green.400'}
                        _hover={{ bg: 'green.500' }}
                        color={'#fff'}
                        onClick={addMoreQuestionField}
                        cursor={'pointer'}
                    >
                        Add Question 
                    </Button>

                    <Button
                        variant={'solid'}
                        bg={'green.400'}
                        _hover={{ bg: 'green.500' }}
                        color={'#fff'}
                        cursor={'pointer'}
                        onClick={saveQuestions}
                    >
                        Save Questions 
                    </Button>
                </Stack>
            </Box>
        </DragDropContext>
    )
}

const StrictModeDroppable = ({ children, ...props }) => {
    const [enabled, setEnabled] = useState(false);
    useEffect(() => {
      const animation = requestAnimationFrame(() => setEnabled(true));
      return () => {
        cancelAnimationFrame(animation);
        setEnabled(false);
      };
    }, []);
    if (!enabled) {
      return null;
    }
    return <Droppable {...props}>{children}</Droppable>;
};

export default QuestionsTab;