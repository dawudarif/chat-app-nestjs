/*
  Warnings:

  - A unique constraint covering the columns `[userId,conversationId]` on the table `ConversationParticipant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ConversationParticipant_userId_conversationId_key" ON "ConversationParticipant"("userId", "conversationId");
