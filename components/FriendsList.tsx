
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import Box from '@mui/material/Box';
import Grid from "@mui/material/Unstable_Grid2";
import { Avatar, MainContainer, Conversation, ConversationList, Search, Sidebar } from '@chatscope/chat-ui-kit-react';
    
interface FriendsListProps {
}

const FriendsList: React.FC<FriendsListProps> = () => {
    const IMG_URL = "https://kellercenter.princeton.edu/sites/default/files/styles/square/public/images/2020%20Incubator%20-%2010X%20Project%20-%20Ivy%20Wang.JPG?h=3ba71f74&itok=0YopKwug";
    return(
            <Grid container flex-direction="column" sx={{
                height: '100%'
            }}>
                <Grid xs={3} sx={{
                    height: '100%'
                }}>
                <Sidebar position="right" scrollable={true} sx={{
                    height: '100%'
                }}>
                    <Box alignVerticalCenter sx={{
                        backgroundColor: 'orange',
                        height: '50px',
                        justifyContent: 'center'
                        
                    }}>
                        Friends and Conversations
                    </Box>
                        <Grid>
                            <Search placeholder="Search your friends" />
                            <ConversationList>
                                <Conversation name="Lilly" lastSenderName="Lilly" info="Yes i can do it for you">
                                    <Avatar src={IMG_URL} name="Lilly" />
                                </Conversation>
                                    
                                <Conversation name="Joe" lastSenderName="Joe" info="Yes i can do it for you">
                                    <Avatar src={IMG_URL} name="Joe" />
                                </Conversation>
                                    
                                <Conversation name="Emily" lastSenderName="Emily" info="Yes i can do it for you">
                                    <Avatar src={IMG_URL} name="Emily" />
                                </Conversation>
                                {/* TODO: ITALICIZE when no message was last sent */}
                                <Conversation name="Kai" info="Start a new message to Kai"> 
                                    <Avatar src={IMG_URL} name="Kai" />
                                </Conversation>
                            </ConversationList>
                        </Grid>
                </Sidebar>
                </Grid>
            </Grid>
    )
}

export default FriendsList;