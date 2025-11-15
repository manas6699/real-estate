'use client'

import { SendHorizontal } from 'lucide-react'
import React, { useState } from 'react'

import { whoami } from '@/utils/whoami'

import axios from 'axios'
import { toast } from 'react-toastify'
import { COMMENTS } from '@/config/api'

interface assigntype {
    assignid : string,
    assignee_id: string
}

const CommentBox = ({ assignid, assignee_id }: assigntype) => {
    const [comment , setComment] = useState("");
    const [loading , setLoading] = useState(false);

    const handleCommentPosting = async () => {
        const Who = whoami();
        // validation
        if(!comment){
            toast.error("Comment Can not be blank!")
            return
        }
        if(!assignid){
            toast.error("Can not post comment without assign id")
            return
        }
        if(!Who){
            toast.error("You are unauthorized!")
            return
        }
        setLoading(true)

        try {
            const newHistoryEntry =  `${Who} Commented : ${comment}`

            const payload = {
                newHistoryEntry: newHistoryEntry,
                assignee_id: assignee_id
            }
            await axios.patch(COMMENTS(assignid) , payload)
            toast.success("Comment Posted!");
           
            setComment("")
            
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error : any) {
            console.error("Error posting comment:", error)
            toast.error(error.response?.data?.message || "Failed to post comment.")
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
            {/* Added margin-bottom for spacing */}
            <p className='text-gray-600 font-extrabold text-sm text-shadow-amber-300 mb-1.5'>
                Comment
            </p>
            <div className="relative w-full">
                <textarea
                    className="border border-pink-500 bg-pink-50 rounded-xl w-full p-3 resize-none 
                     placeholder:text-gray-400 
                     text-sm sm:text-base 
                     pr-14 sm:pr-16" // Responsive padding for the button
                    name="comments"
                    id="comments"
                    placeholder="Post your comments..."
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={loading}
                />
                <button
                    className="absolute bottom-3 right-3 cursor-pointer bg-pink-500 text-white rounded-full 
                     flex items-center justify-center 
                     hover:bg-pink-600 transition-colors 
                     focus:outline-none focus:ring-2 focus:ring-pink-400
                     w-8 h-8 sm:w-10 sm:h-10" // Responsive button size
                    aria-label="Post comment"
                    onClick={handleCommentPosting}
                    disabled={loading}
                >
                  
                    <SendHorizontal className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                    
                </button>
            </div>
        </>
    )
}

export default CommentBox