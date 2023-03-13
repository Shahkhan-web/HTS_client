--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2 (Ubuntu 15.2-1.pgdg22.04+1)
-- Dumped by pg_dump version 15.2 (Ubuntu 15.2-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: qr_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.qr_info (
    "timestamp" character varying(250) NOT NULL,
    user_id integer NOT NULL,
    ticket_id character varying(250) NOT NULL,
    honey_origin character varying(250),
    honey_type character varying(250),
    honey_weight character varying(250),
    honey_coordinates character varying(250),
    h_m_f character varying(250),
    moister character varying(250),
    acidity character varying(250),
    ph character varying(250),
    color character varying(250),
    electrical_cunductivity character varying(250),
    diastate character varying(250)
);


ALTER TABLE public.qr_info OWNER TO postgres;

--
-- Name: qr_info_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.qr_info_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.qr_info_user_id_seq OWNER TO postgres;

--
-- Name: qr_info_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.qr_info_user_id_seq OWNED BY public.qr_info.user_id;


--
-- Name: qr_info user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qr_info ALTER COLUMN user_id SET DEFAULT nextval('public.qr_info_user_id_seq'::regclass);


--
-- Data for Name: qr_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.qr_info ("timestamp", user_id, ticket_id, honey_origin, honey_type, honey_weight, honey_coordinates, h_m_f, moister, acidity, ph, color, electrical_cunductivity, diastate) FROM stdin;
\.


--
-- Name: qr_info_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.qr_info_user_id_seq', 60, true);


--
-- Name: qr_info constraintname; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qr_info
    ADD CONSTRAINT constraintname UNIQUE (user_id);


--
-- Name: qr_info qr_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qr_info
    ADD CONSTRAINT qr_info_pkey PRIMARY KEY (user_id);


--
-- PostgreSQL database dump complete
--

