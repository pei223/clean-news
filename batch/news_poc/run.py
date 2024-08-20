import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.output_parsers import StrOutputParser
from langchain_core.chat_history import InMemoryChatMessageHistory

title = "「日本語を教えて時給5000円」ドル払い副業の実践者が語る"
body = """
「この一週間頑張った報酬1800ドルが無事に今日振り込まれました」 【映像】時給5000円！ 「AIに日本語を教える仕事」とは？1週間で1800ドル、およそ29万円の報酬を得ているというXの書き込み。何か怪しい仕事では？と思ってしまうが、この投稿をしたほげたろさんに話を聞いた。ほげたろさんが行っているのはアメリカの会社によるフルリモートの仕事で「AIが作った日本語を採点・修正ポイントを指摘する」というもの
"""


topic_sets = [
    "スポーツ",
    "芸能",
    "地域",
    "政治",
    "経済",
    "技術",
    "エッセイ"
]

quality_labels = [
]

careful_labels = [
    "広告",
    "ステルスマーケティング",
    "センシティブ",
    "犯罪",
    "スピリチュアル",
    "宗教",
    "陰謀論",
    "誹謗中傷",
    "炎上",
    "不祥事",
]


model = ChatOpenAI(model="gpt-3.5-turbo-0125")
# model = ChatOpenAI(model="gpt-4o")


careful_labels_prompt = ChatPromptTemplate.from_template("""
先ほどの記事の内容で以下の中から当てはまるものを全て教えてください。
完全に当てはまるもののみ選択して、疑わしいものは選ばないでください。
[{careful_labels}]

回答はこのようなCSV形式で教えてください。
[芸能,スポーツ]  
""")

topic_prompt = ChatPromptTemplate.from_template("""
新しい記事を記憶してください。
この記事に当てはまるトピックを以下の中から全て選んでください。
完全に当てはまるもののみ選択して、疑わしいものは選ばないでください。
[{topics}]

回答はこのようなCSV形式で教えてください。
[芸能,スポーツ]

以下は記事の情報です。
タイトル: {title}
本文
---
{body}
---
""")


history = InMemoryChatMessageHistory()

print(topic_prompt, end="\n\n\n")
print(careful_labels_prompt, end="\n\n\n")

session_id = "42"

topics_chain = RunnableWithMessageHistory(
    topic_prompt | model | StrOutputParser(),
    lambda x: history,
    input_messages_key="body",
)
topics_chain = topic_prompt | model | StrOutputParser()
careful_labels_chain = RunnableWithMessageHistory(
    careful_labels_prompt | model | StrOutputParser(),
    lambda x: history,
    input_messages_key="body",
)
careful_labels_chain = careful_labels_prompt | model | StrOutputParser()


res = topics_chain.invoke({
    "body": body,
    "title": title,
    "topics": ",".join(topic_sets),
}, config={
    "configurable": {"session_id": session_id}
})
print(res)

res = careful_labels_chain.invoke({
    "careful_labels": ",".join(careful_labels)
}, config={
    "configurable": {"session_id": session_id}
})
print(res)
