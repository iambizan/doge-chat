//& components
import MyMessage from "./MyMessage";
import TheirMessage from "./TheirMessage";
import MessageForm from "./MessageForm";
import { useEffect, useRef, useState } from "react";

const ChatFeed = (props) => {
	//~ destructuring
	const { chats, activeChat, userName, messages } = props;

	const [typer, setTyper] = useState(null);

	//* current chat
	const chat = chats && chats[activeChat];

	const dummyRef = useRef();

	useEffect(() => {
		//* scrolling to the bottom
		dummyRef.current &&
			dummyRef.current.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const renderReadReceipts = (message, isMyMessage) => {
		return chat.people.map((person, index) => {
			return (
				person.last_read === message.id && (
					<div
						key={`read_${index}`}
						className="read-receipt"
						style={{
							float: isMyMessage ? "right" : "left",
							backgroundImage:
								person.person.avatar && `url(${person.person.avatar})`,
						}}
					/>
				)
			);
		});
	};

	const renderMessages = () => {
		//& extracting the keys from the messages
		const keys = Object.keys(messages);

		return keys.map((key, index) => {
			const message = messages[key];
			const lastMessagekey = index === 0 ? null : keys[index - 1];
			const isMyMessage = userName === message.sender.username;

			return (
				<div key={`msg_${index}`} style={{ width: "100%" }}>
					<div className="message-block">
						{isMyMessage ? (
							<MyMessage message={message} />
						) : (
							<TheirMessage
								message={message}
								lastMessage={messages[lastMessagekey]}
							/>
						)}
					</div>
					<div
						className="read-receipts"
						style={{
							marginRight: isMyMessage ? "18px" : "0px",
							marginLeft: isMyMessage ? "0px" : "68px",
						}}
					>
						{renderReadReceipts(message, isMyMessage)}
					</div>
				</div>
			);
		});
	};

	const logout = () => {
		localStorage.setItem("username", "");
		localStorage.setItem("password", "");
		window.location.reload();
	};

	if (!chat) return <div className="">Loading...</div>;

	return (
		<div className="chat-feed">
			<div className="chat-title-container">
				<div className="chat-title">{chat.title}</div>
				<div className="chat-subtitle">
					{chat.people.map((person) => ` ${person.person.username}`)}
				</div>
			</div>
			{renderMessages()}
			<div
				ref={dummyRef}
				style={{
					height: "100px",
					paddingTop: "1vh",
					paddingLeft: "1rem",
				}}
			>
				{typer ? `${typer} is typing...` : null}
			</div>
			<div className="message-form-container">
				<MessageForm
					{...props}
					chatId={activeChat}
					dummyRef={dummyRef}
					typer={typer}
					setTyper={setTyper}
				/>
			</div>
			<div className="log-out" onClick={logout}>
				Sign Out
			</div>
		</div>
	);
};

export default ChatFeed;
