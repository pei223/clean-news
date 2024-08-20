import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.output_parsers import (
    StrOutputParser,
    CommaSeparatedListOutputParser,
)
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage


title = "東海道新幹線の保守用車同士が衝突し脱線 JR東海が記者会見で陳謝"
body = """
　東海道新幹線の保守用車同士の衝突事故で、JR東海が22日夜に東京都内で開いた記者会見では、原因や復旧作業の経緯について質問が集中した。夏休みシーズン開始直後の多くの旅客に影響し、担当者は「ご旅行に大変なご迷惑をおかけしたことを深くおわびする」と陳謝した。

　午後8時過ぎに始まった会見で、同社の川越洋施設部長は「故障車の壊れ方が思ったよりひどかった」と述べ、復旧作業の遅れにつながったと振り返った。

　事故原因については、ブレーキが作動せず、減速しないまま約40キロで衝突したなどと説明。その後も、復旧の見通しや影響人員についての質問が相次いだが「検討中」などと答えるにとどめた
"""


topic_sets = [
    "スポーツ",
    "芸能",
    "ゴシップ",
    "地域",
    "政治",
    "経済",
    "技術",
    "科学",
    "エッセイ",
    "トレンド",
    "映画",
    "エンタメ",
    "海外",
    "国内",
    "SNS",
    "トレンド",
    "生活",
    "恋愛",
]

quality_labels = ["科学的根拠なし", ""]

careful_labels = [
    "広告",
    "ステルスマーケティング",
    "センシティブ",
    "犯罪",
    "暴力的",
    "非道徳",
    "スピリチュアル",
    "宗教",
    "陰謀論",
    "誹謗中傷",
    "炎上",
    "不祥事",
    "不倫",
]

# model = ChatOpenAI(model="gpt-3.5-turbo-0125")
# model = ChatOpenAI(model="gpt-4o")
model = ChatOpenAI(model="gpt-4o-mini")

article_input = f"""
このあと以下の記事について質問するので、詳細に記憶してください。
返信は不要なので""と出力してください。
タイトル: {title}
本文
---
{body}
---
"""

topic_input = f"""
記事の内容で以下の中から一致するトピックを全て選んでください。
選択肢にないものや疑わしいものは絶対に選ばないでください。
[{",".join(topic_sets)}]

回答はCSV形式で教えてください。
"""

careful_label_input = f"""
記事の内容で以下の中から一致する選択肢を全て選んでください。
明確な理由がないもの、選択肢にないものや疑わしいものは絶対に選ばないでください。
[{",".join(careful_labels)}]

回答はCSV形式で教えてください。
一致するものがなければ空文字を出力してください。
"""


quality_label_input = f"""
記事の内容で以下の中から一致する選択肢を全て選んでください。
明確な理由がないもの、選択肢にないものや疑わしいものは絶対に選ばないでください。
[{",".join(careful_labels)}]

回答はCSV形式で教えてください。
一致するものがなければ""を出力してください。
"""


history = InMemoryChatMessageHistory()

session_id = "100"

memorize_chain = RunnableWithMessageHistory(
    model | StrOutputParser(),
    lambda x: history,
)


memorize_res = memorize_chain.invoke(
    article_input, config={"configurable": {"session_id": session_id}}
)
print(memorize_res)

# topic_chain = RunnableWithMessageHistory(
#     selection_prompt | model | StrOutputParser(),
#     lambda x: history,
# )
# careful_label_chain = RunnableWithMessageHistory(
#     selection_prompt | model | StrOutputParser(),
#     lambda x: history,
# )
# topic_res = topic_chain.invoke({
#     "selections": ",".join(topic_sets)
# }, config={
#     "configurable": {"session_id": session_id}
# })
# print(topic_res)
# careful_labels_res = careful_label_chain.invoke({
#     "selections": ",".join(careful_labels)
# }, config={
#     "configurable": {"session_id": session_id}
# })
# print(careful_labels_res)


topic_chain = RunnableWithMessageHistory(
    model | CommaSeparatedListOutputParser(),
    lambda x: history,
)
careful_label_chain = RunnableWithMessageHistory(
    model | CommaSeparatedListOutputParser(),
    lambda x: history,
)

print(topic_input)
print(careful_label_input)
topic_res = topic_chain.invoke(
    topic_input, config={"configurable": {"session_id": session_id}}
)
print(topic_res)
careful_labels_res = careful_label_chain.invoke(
    careful_label_input, config={"configurable": {"session_id": session_id}}
)
print(careful_labels_res)
