import React, { useState, useContext, useLayoutEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions
} from 'react-native'
import FastImage from 'react-native-fast-image'

const width = Dimensions.get('window').width

import { ThemeContext } from './Contexts/ThemeContext'
import TextBody from './TextBody'
import { imgPrefixOriginal } from './Utilities/Utilities'

export default function Comment({ comment }) {
    const theme = useContext(ThemeContext)

    //low quality users are users who usually comment in most movies with links to external websites.
    //these comments are excluded for safety reasons, but also because they usually give the impression
    //that the comments are full of spam.
    const lowQualityCommenters = ['garethmb', 'bastag', 'msbreviews', 'hweird1', 'maketheswitch']

    const [commentHidden, setCommentHidden] = useState(false)
    const [commentText, setCommentText] = useState('')

    const styles = StyleSheet.create({
        container: {
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginTop: 15,
        },
        commentContainer: {
            backgroundColor: theme.gray,
            borderRadius: theme.borderRadius,
            paddingVertical: theme.defaultPadding,
            width: width * 0.8,
            marginRight: theme.defaultPadding,
        },
        avatarContainer: {
            width: width * 0.3,
            backgroundColor: 'blue',
        },
        avatar: {
            height: width * 0.07,
            width: width * 0.07,
            marginRight: width * 0.025,
            marginLeft: theme.defaultPadding,
            borderRadius: 30,
            backgroundColor: theme.accent
        },
        authorContainer: {
            paddingHorizontal: theme.defaultPadding,
            flexDirection: 'row',
            alignItems: 'center'
        },
        author: {
            color: theme.accent,
            fontFamily: theme.fontBold,
        },
        text: {
            color: commentHidden ? theme.foreground : theme.foreground + '4c',
            fontFamily: commentHidden ? theme.fontRegular : theme.fontBold,
        }
    })

    useLayoutEffect(() => {
        filterComment()
    })

    function parseAvatarUrl() {
        //some avatar image urls come with full links and some don't. this function checks for that and returns full links
        const path = comment.author_details.avatar_path
        if (path.includes('https://')) {
            return path.slice(1)
        }
        return imgPrefixOriginal + path
    }

    function filterComment() {
        var removeHtmlRegex = /(<([^>]+)>)/ig
        var urlCheckRegex = new RegExp('([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?([^ ])+').test(comment.content)
        if (lowQualityCommenters.includes(comment.author_details.username.toLowerCase()) || urlCheckRegex) {
            setCommentHidden(true)
            setCommentText('This comment has been automatically hidden because our systems tagged it as being low quality and/or harmful')
            return
        }
        setCommentText(comment.content.
            replaceAll('_', '').
            replaceAll('*', '').
            replaceAll(removeHtmlRegex, "")
        )
    }

    return (
        <View style={styles.container}>
            <View styles={styles.avatarContainer}>
                <FastImage
                    style={styles.avatar}
                    source={comment.author_details.avatar_path ?
                        { uri: parseAvatarUrl() } :
                        require('../assets/images/profile_default.png')
                    }
                />
            </View>
            <View style={styles.commentContainer}>
                <View style={styles.authorContainer}>
                    <Text style={styles.author}>
                        {comment.author_details ? comment.author_details.username.toLowerCase().replace(' ', '') : comment.author} thinks:
                    </Text>
                </View>
                <TextBody
                    text={commentText}
                    hideIfLong
                    maxTextHeight={300}
                    marginTop={10}
                    greyedOut={commentHidden ? true : false}
                    bold={commentHidden ? true : false}
                />
            </View>
        </View>
    )
}