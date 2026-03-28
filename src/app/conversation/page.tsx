"use client";

import dynamic from 'next/dynamic'

// import ConversationModul from "@/components/conversation/ConversationModul";

const ConversationModul = dynamic(() => import('@/components/conversation/ConversationModul'), {
  ssr: false
})


const ConversationPage = () => {
  return <ConversationModul />;
};

export default ConversationPage;
