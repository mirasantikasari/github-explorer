"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUserDetail, fetchUserDetail, fetchUsers } from "@/lib/userSlice";
import { RootState, AppDispatch } from "@/lib/store";
import styled from "styled-components";
import Loader from "./components/Loader";
import { FaChevronDown, FaChevronUp, FaStar } from "react-icons/fa";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
    flex: 1;
    max-width: 670px;
    margin: auto;
`;

const Input = styled.input`
    padding: 12px;
    border: 1px solid #ccc;
    background: #f2f2f2;
    border-radius: 5px;
    font-size: 16px;
`

const Title    = styled.h1`
    text-align: center
`

const Button    = styled.button`
    padding: 12px;
    background: #2d9cdb;
    color: #ffffff;
    border: none;
`

const Error     = styled.p`
    color: red;
`

const Text      = styled.p`
    margin-bottom: 0px;
    margin-top:2px;
    color: #9b9595;
`

const AccordionItem = styled.div`
    border: 1px solid #ccc;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 10px;
`;

const AccordionHeader = styled.div<{ open: boolean }>`
    background-color: ${({ open }) => (open ? "#f2f2f2" : "#f5f5f5")};
    color: #000;
    padding: 10px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const AccordionContent = styled.div<{ open: boolean }>`
    max-height: ${({ open }) => (open ? "300px" : "0")};
    overflow-y: scroll;
    overflow-x: hidden;
    padding: ${({ open }) => (open ? "10px" : "0")};
    transition: max-height 0.3s, padding 0.3s;
    background: #fafafa;
`;

const IconWrapper = styled.div`
    margin-left: auto;
    display: flex;
    align-items: center;
`;

const Card = styled.div`
    padding: 10px;
    background: #dbdbdb;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
`

const TitleText = styled.p`
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 10px;
    margin-top: 0px;
`

const Description = styled.p`
    margin-bottom: 10px;
    margin-top: 0px;
    font-size: 14px;
    color: #555;
    margin-top: 5px;
`

const StarWrapper = styled.div`
    display: flex;
    gap: 5px;
    font-size: 16px;
`;

const StarCount = styled.span`
    margin-right: 10px;
    font-weight: bold;
    font-size: 16px;
`

export default function Home() {
    const [query, setQuery]                                = useState<string>("");
    const dispatch                                         = useDispatch<AppDispatch>();
    const [isPageLoading, setIsPageLoading]                = useState<boolean>(true);
    const [openUser, setOpenUser]                          = useState<number | null>(null);
    const { keyword, users, repositories, loading, error } = useSelector((state: RootState) => state.user);

    const handleSearch = () => {
        if (query.trim().length > 0) {
            dispatch(fetchUsers(query));
        }
    };

    const toggleAccordion = (userId: number, username: string) => {

        if(openUser == userId) {
            setOpenUser(null);
            dispatch(clearUserDetail())
        } else {
            setOpenUser(userId)
            dispatch(fetchUserDetail(username))
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setIsPageLoading(false);
        }, 1000);
    }, []);

    return (

        <>
            { isPageLoading  && <Loader/> }

            {
                !isPageLoading &&
                <Container>
                    <Title>GitHub User Search</Title>
                    <Input type="text" placeholder="Enter username..." value={query} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
                    <Button onClick={handleSearch} disabled={loading}>
                        {loading ? "Loading..." : "Search"}
                    </Button>
                    {error && <Error>{error}</Error>}

                    {/* List */}
                    {keyword && <Text>Showing users for &quot;{keyword}&quot;</Text>}
                    <div>
                        {users?.map((user: { id: number, login: string }) => (
                            <AccordionItem key={user.id}>
                                <AccordionHeader open={openUser === user.id} onClick={() => toggleAccordion(user.id, user.login)}>
                                    {user.login}
                                    <IconWrapper>
                                        {openUser === user.id ? <FaChevronUp /> : <FaChevronDown />}
                                    </IconWrapper>
                                </AccordionHeader>
                                <AccordionContent open={openUser === user.id}>
                                    {
                                        repositories.map((repo: {id: number, name: string, description: string, stargazers_count: number}) => (
                                            <Card key={repo.id}>
                                                <div>
                                                    <TitleText>{repo.name}</TitleText>
                                                    <Description>{repo.description}</Description>
                                                </div>
                                                <StarWrapper>
                                                    <StarCount>{repo.stargazers_count}</StarCount>
                                                    <FaStar/>
                                                </StarWrapper>
                                            </Card>
                                        ))
                                    }
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </div>
                </Container>
            }
        </>
    );
}
