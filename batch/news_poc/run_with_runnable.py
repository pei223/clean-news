import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.output_parsers import StrOutputParser
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage


title = "「日本語を教えて時給5000円」ドル払い副業の実践者が語る"
body = """
「この一週間頑張った報酬1800ドルが無事に今日振り込まれました」 【映像】時給5000円！ 「AIに日本語を教える仕事」とは？1週間で1800ドル、およそ29万円の報酬を得ているというXの書き込み。何か怪しい仕事では？と思ってしまうが、この投稿をしたほげたろさんに話を聞いた。ほげたろさんが行っているのはアメリカの会社によるフルリモートの仕事で「AIが作った日本語を採点・修正ポイントを指摘する」というもの
"""


topic_sets = ["スポーツ", "芸能", "地域", "政治", "経済", "技術", "エッセイ"]

quality_labels = []

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

# model = ChatOpenAI(model="gpt-3.5-turbo-0125")
model = ChatOpenAI(model="gpt-4o")

memorize_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            f"""
以下の新しい記事を記憶してください。
タイトル: {title}
本文
---
{body}
---
""",
        ),
        ("placeholder", "{chat_history}"),
        # HumanMessage("{input}"),
        ("human", "{input}"),
    ]
)

topic_input = f"""
記事の内容で以下の中から当てはまるものを全て教えてください。
完全に当てはまるもののみ選択して、疑わしいものは選ばないでください。
[{",".join(topic_sets)}]

回答は以下のようなCSV形式で教えてください。
[芸能,スポーツ]
"""

careful_labels_input = f"""
記事の内容で以下の中から当てはまるものを全て教えてください。
完全に当てはまるもののみ選択して、疑わしいものは選ばないでください。
[{",".join(careful_labels)}]

回答はこのようなCSV形式で教えてください。
[芸能,スポーツ]
"""

history = InMemoryChatMessageHistory()

session_id = "42"

topics_chain = RunnableWithMessageHistory(
    memorize_prompt | model | StrOutputParser(),
    lambda x: history,
    input_messages_key="input",
    # output_messages_key="output",
)
careful_labels_chain = RunnableWithMessageHistory(
    memorize_prompt | model | StrOutputParser(),
    lambda x: history,
    input_messages_key="input",
    # output_messages_key="output",
)


res = topics_chain.invoke(
    {
        "input": topic_input,
    },
    config={"configurable": {"session_id": session_id}},
)
print(res)

res = careful_labels_chain.invoke(
    {
        "input": careful_labels_input,
    },
    config={"configurable": {"session_id": session_id}},
)
print(res)
