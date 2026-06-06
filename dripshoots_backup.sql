--
-- PostgreSQL database dump
--

\restrict WcDHU6VheyJBigxD1vlRBfNoVFOJV17Fv3b3bZACOlVJjgJaqTcMX6JhCe2IHhq

-- Dumped from database version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: dripshoots_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO dripshoots_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: GeneratedImage; Type: TABLE; Schema: public; Owner: dripshoots_user
--

CREATE TABLE public."GeneratedImage" (
    id text NOT NULL,
    "projectId" text NOT NULL,
    "imageUrl" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."GeneratedImage" OWNER TO dripshoots_user;

--
-- Name: Project; Type: TABLE; Schema: public; Owner: dripshoots_user
--

CREATE TABLE public."Project" (
    id text NOT NULL,
    "userId" text NOT NULL,
    name text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    gender text NOT NULL,
    ethnicity text NOT NULL,
    occasion text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Project" OWNER TO dripshoots_user;

--
-- Name: Reel; Type: TABLE; Schema: public; Owner: dripshoots_user
--

CREATE TABLE public."Reel" (
    id text NOT NULL,
    "projectId" text NOT NULL,
    "videoUrl" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Reel" OWNER TO dripshoots_user;

--
-- Name: Upload; Type: TABLE; Schema: public; Owner: dripshoots_user
--

CREATE TABLE public."Upload" (
    id text NOT NULL,
    "projectId" text NOT NULL,
    "imageUrl" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Upload" OWNER TO dripshoots_user;

--
-- Name: User; Type: TABLE; Schema: public; Owner: dripshoots_user
--

CREATE TABLE public."User" (
    id text NOT NULL,
    "clerkId" text NOT NULL,
    email text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "wpAppPassword" text,
    "wpConsumerKey" text,
    "wpConsumerSecret" text,
    "wpSiteUrl" text,
    credits integer DEFAULT 10 NOT NULL,
    "creditsLimit" integer DEFAULT 10 NOT NULL,
    "creditsUsed" integer DEFAULT 0 NOT NULL,
    plan text DEFAULT 'free'::text NOT NULL,
    "planExpiresAt" timestamp(3) without time zone,
    "stripeCustomerId" text,
    "approvedAt" timestamp(3) without time zone,
    "approvedBy" text,
    "pkrPlan" text DEFAULT 'free'::text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL
);


ALTER TABLE public."User" OWNER TO dripshoots_user;

--
-- Data for Name: GeneratedImage; Type: TABLE DATA; Schema: public; Owner: dripshoots_user
--

COPY public."GeneratedImage" (id, "projectId", "imageUrl", "createdAt") FROM stdin;
cmpx3sfkk0004u3x9u0bcx8ir	cmpx3sfkk0002u3x97c51e7wm	/generated/generated-1780432910672-0.jpg	2026-06-02 20:41:57.716
cmpx3sfkk0005u3x95kn4gtkk	cmpx3sfkk0002u3x97c51e7wm	/generated/generated-1780432910672-1.jpg	2026-06-02 20:41:57.716
cmpx3sfkk0006u3x9m7dspp66	cmpx3sfkk0002u3x97c51e7wm	/generated/generated-1780432910672-2.jpg	2026-06-02 20:41:57.716
cmpx3sfkk0007u3x9patrzur3	cmpx3sfkk0002u3x97c51e7wm	/generated/generated-1780432910672-3.jpg	2026-06-02 20:41:57.716
cmpx3sfkk0008u3x9nm07xl75	cmpx3sfkk0002u3x97c51e7wm	/generated/generated-1780432910672-4.jpg	2026-06-02 20:41:57.716
cmpx3sfkk0009u3x9jdccsmdm	cmpx3sfkk0002u3x97c51e7wm	/generated/generated-1780432910672-5.jpg	2026-06-02 20:41:57.716
cmpx3sfkk000au3x95i3r4ida	cmpx3sfkk0002u3x97c51e7wm	/generated/generated-1780432910672-6.jpg	2026-06-02 20:41:57.716
cmpx3sfkk000bu3x9aj5lpc5c	cmpx3sfkk0002u3x97c51e7wm	/generated/generated-1780432910672-7.jpg	2026-06-02 20:41:57.716
cmpx3v44m000gu3x9cdw4qpcx	cmpx3v44m000eu3x9i1irj0cb	/generated/generated-1780433041752-0.jpg	2026-06-02 20:44:02.854
cmpx3x4zl000lu3x98d67ezj0	cmpx3x4zl000ju3x9iziezz55	/generated/generated-1780433136227-0.jpg	2026-06-02 20:45:37.282
cmpx41q65000qu3x91br94fwb	cmpx41q65000ou3x974u3f3oi	/generated/generated-1780433350323-0.jpg	2026-06-02 20:49:11.358
cmpx41svs000vu3x9kpdl9svy	cmpx41svs000tu3x9e5e3nt5f	/generated/generated-1780433352391-0.jpg	2026-06-02 20:49:14.872
cmpx41svs000wu3x97tb8k1wh	cmpx41svs000tu3x9e5e3nt5f	/generated/generated-1780433352391-1.jpg	2026-06-02 20:49:14.872
cmpx41svs000xu3x9rw7m0ak5	cmpx41svs000tu3x9e5e3nt5f	/generated/generated-1780433352391-2.jpg	2026-06-02 20:49:14.872
cmpx4ff620012u3x9a490c603	cmpx4ff620010u3x9d09gcgry	/generated/generated-1780433988372-0.jpg	2026-06-02 20:59:50.282
cmpx4ff620013u3x9sjm9ardy	cmpx4ff620010u3x9d09gcgry	/generated/generated-1780433988372-1.jpg	2026-06-02 20:59:50.282
cmpx4kg1p0018u3x9f13al4e9	cmpx4kg1p0016u3x9zvien3wt	/generated/generated-1780434222712-0.jpg	2026-06-02 21:03:44.701
cmpx4kg1p0019u3x9fqc29net	cmpx4kg1p0016u3x9zvien3wt	/generated/generated-1780434222712-1.jpg	2026-06-02 21:03:44.701
cmpx4uvsl0004c5r1err6duix	cmpx4uvsl0002c5r10rt2eygl	/generated/generated-1780434709677-0.jpg	2026-06-02 21:11:51.669
cmpx4uvsl0005c5r1hb1y9ode	cmpx4uvsl0002c5r10rt2eygl	/generated/generated-1780434709677-1.jpg	2026-06-02 21:11:51.669
cmpx4vjy4000ac5r17fpkc0v5	cmpx4vjy40008c5r1ywjkb21f	/generated/generated-1780434739691-0.jpg	2026-06-02 21:12:22.973
cmpx4vjy4000bc5r177730v17	cmpx4vjy40008c5r1ywjkb21f	/generated/generated-1780434739691-1.jpg	2026-06-02 21:12:22.973
cmpx4vjy4000cc5r1mw7ek3hs	cmpx4vjy40008c5r1ywjkb21f	/generated/generated-1780434739691-2.jpg	2026-06-02 21:12:22.973
cmpx4vjy4000dc5r1drw4npvm	cmpx4vjy40008c5r1ywjkb21f	/generated/generated-1780434739691-3.jpg	2026-06-02 21:12:22.973
cmpx4yx3c000ic5r15a7ijtcj	cmpx4yx3c000gc5r1enttpwfq	/generated/generated-1780434898127-0.jpg	2026-06-02 21:14:59.976
cmpx4yx3c000jc5r1ehwlxnje	cmpx4yx3c000gc5r1enttpwfq	/generated/generated-1780434898127-1.jpg	2026-06-02 21:14:59.976
cmpx5du8x0004rxdqtxp2x0el	cmpx5du8x0002rxdqt5wev9pq	/generated/generated-1780435594367-0.jpg	2026-06-02 21:26:36.13
cmpx5du8x0005rxdq3ul2u9ks	cmpx5du8x0002rxdqt5wev9pq	/generated/generated-1780435594367-1.jpg	2026-06-02 21:26:36.13
cmpx7sma5000413809rb8oj2f	cmpx7sma5000213801m3tcc82	/generated/generated-1780439639715-0.jpg	2026-06-02 22:34:04.877
cmpx7sma500051380kys50ty4	cmpx7sma5000213801m3tcc82	/generated/generated-1780439639715-1.jpg	2026-06-02 22:34:04.877
cmpx7sma500061380nw5bxrhj	cmpx7sma5000213801m3tcc82	/generated/generated-1780439639715-2.jpg	2026-06-02 22:34:04.877
cmpx7sma500071380m5gdyrqh	cmpx7sma5000213801m3tcc82	/generated/generated-1780439639715-3.jpg	2026-06-02 22:34:04.877
cmpx7sma500081380om60rb06	cmpx7sma5000213801m3tcc82	/generated/generated-1780439639715-4.jpg	2026-06-02 22:34:04.877
cmpx7sma500091380bkragtai	cmpx7sma5000213801m3tcc82	/generated/generated-1780439639715-5.jpg	2026-06-02 22:34:04.877
cmpye3jho0004k3pkuiwtt77p	cmpye3jho0002k3pk0kf0no35	/generated/generated-1780510697353-0.jpg	2026-06-03 18:18:18.348
cmpznkq1b0008wxzxfe41trn4	cmpznkq1b0006wxzximrmix0o	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780587081/dripshoots/kqer36z3jxhwl0t6mt3j.png	2026-06-04 15:31:22.703
cmpzuuold000517kj9rc31i1l	cmpzuuold000317kjllc1ymj8	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780599304/dripshoots/fpoj85sptrwsjjlngwxn.jpg	2026-06-04 18:55:04.705
cmq05nw3w0009xe7t8djlhryl	cmq05nw3w0007xe7t5o6j6b5u	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780617428/dripshoots/yfsno1qtqpibbo1ndlpo.png	2026-06-04 23:57:43.628
cmq05nw3w000axe7t8gfywtv3	cmq05nw3w0007xe7t5o6j6b5u	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780617429/dripshoots/huc1lnaseboerfdzpsk4.png	2026-06-04 23:57:43.628
cmq05nw3w000bxe7tqzvs2sh2	cmq05nw3w0007xe7t5o6j6b5u	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780617462/dripshoots/fg09tf2pgirt38awkjij.png	2026-06-04 23:57:43.628
cmq05nw3w000cxe7tufxyis89	cmq05nw3w0007xe7t5o6j6b5u	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780617462/dripshoots/gsryu0j8jlfbzfzq9hry.png	2026-06-04 23:57:43.628
cmq05zmnr0006iyc0ubl7ibls	cmq05zmnr0004iyc0u90kqvgq	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780618010/dripshoots/ifjqg7ki5t5xpassmzkt.png	2026-06-05 00:06:51.255
cmq0649yz000biyc052a5voor	cmq0649yz0009iyc0uz16qipd	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780618174/dripshoots/fdnbyvcc1yzha6jkx0pc.png	2026-06-05 00:10:28.092
cmq0649yz000ciyc0e6gemlsh	cmq0649yz0009iyc0uz16qipd	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780618176/dripshoots/tiupml8a4qbk713ljru9.png	2026-06-05 00:10:28.092
cmq0649yz000diyc08h8ahb7q	cmq0649yz0009iyc0uz16qipd	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780618226/dripshoots/zcy7vyn3o0n1tmp18sej.png	2026-06-05 00:10:28.092
cmq0649yz000eiyc04xj2362i	cmq0649yz0009iyc0uz16qipd	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780618227/dripshoots/bdplmltrcr5seya2taao.png	2026-06-05 00:10:28.092
cmq06b6l4000kiyc03s8kjv5l	cmq06b6l3000iiyc00de0z7qd	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780618549/dripshoots/sljvc5lalrxp3smlwfpp.png	2026-06-05 00:15:50.296
cmq06f8t0000riyc06u4ladnn	cmq06f8t0000piyc00krd6377	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780618738/dripshoots/iefmafjexqxfzfvnlp4q.png	2026-06-05 00:18:59.796
cmq06ggh4000viyc0dz92u0l8	cmq06ggh4000tiyc0b26clj8j	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780618738/dripshoots/euv64is4ot8fekld6zu7.png	2026-06-05 00:19:56.392
cmq06ggh4000wiyc08tqtukon	cmq06ggh4000tiyc0b26clj8j	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780618795/dripshoots/xm9t6eos8lbdqxtm9dti.png	2026-06-05 00:19:56.392
cmq06hiw10011iyc05u4r3540	cmq06hiw1000ziyc0bm6pan5n	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780618845/dripshoots/xcwnatkqrjivcj2ddfzv.png	2026-06-05 00:20:46.177
cmq06k9tw0016iyc06mezp1id	cmq06k9tw0014iyc0p9vmv0ns	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780618973/dripshoots/ap76vyrao0gjhfwfkrbl.png	2026-06-05 00:22:54.405
cmq06u6kv001diyc01uk65c0u	cmq06u6ku001biyc0k2pssrbb	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780619363/dripshoots/qgyixiwp90wx48rxieyq.png	2026-06-05 00:30:36.751
cmq06u6kv001eiyc07odmmzas	cmq06u6ku001biyc0k2pssrbb	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780619399/dripshoots/nfvaq39kyk6twhipxrlz.png	2026-06-05 00:30:36.751
cmq06u6kv001fiyc0joc7r24v	cmq06u6ku001biyc0k2pssrbb	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780619436/dripshoots/t2kcm71epjx5jkf4kdax.png	2026-06-05 00:30:36.751
cmq06ykyh001liyc08gaeutf2	cmq06ykyh001jiyc0pzdre4tg	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780619606/dripshoots/zbiezbnqbk9e1hhzjyp8.png	2026-06-05 00:34:02.009
cmq06ykyh001miyc0q748k8ot	cmq06ykyh001jiyc0pzdre4tg	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780619640/dripshoots/k8revmcni6leqpl6eeqx.png	2026-06-05 00:34:02.009
cmq09m90i001wiyc0gcpbow82	cmq09m90i001uiyc0cbqnqqoq	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780624058/dripshoots/i1o29moslpygn6lxli8g.png	2026-06-05 01:48:25.506
cmq09m90i001xiyc0crueatmq	cmq09m90i001uiyc0cbqnqqoq	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780624104/dripshoots/wn5sdweegx2uot0kqygt.png	2026-06-05 01:48:25.506
cmq11id0000051qilctyimib0	cmq11iczz00031qilob70nohh	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780670952/dripshoots/ayhukt3zxvatwbydfveg.png	2026-06-05 14:49:13.296
cmq12s5jj000b1qilosqxjs5l	cmq12s5jj00091qiltxcc89kb	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780673088/dripshoots/ildknhzmu33oqfq5zo6e.png	2026-06-05 15:24:49.807
cmq12vst3000h1qillv6irwnn	cmq12vst3000f1qil5kpo85ja	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780673259/dripshoots/ogiev0m9e3pflbkhty2i.png	2026-06-05 15:27:39.927
cmq1300xx000q1qilsvv79sfo	cmq1300xx000o1qil1s4ftvar	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780673456/dripshoots/q0nayqh2hyoap9qb1qrj.png	2026-06-05 15:30:57.094
cmq13botj000y1qilbi7ybtmy	cmq13botj000w1qilkoailuc2	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780673999/dripshoots/xekbienykcbp7gellion.png	2026-06-05 15:40:01.255
cmq13botj000z1qilenbqacme	cmq13botj000w1qilkoailuc2	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780674000/dripshoots/ufjtwdjpfcv2gqplfwgq.png	2026-06-05 15:40:01.255
cmq13mja800171qilaobimt1y	cmq13mja800151qilcavqmw8a	https://res.cloudinary.com/dkkbwkihu/image/upload/v1780674506/dripshoots/xwl6tfoacdlzdhy1vqnb.png	2026-06-05 15:48:27.297
\.


--
-- Data for Name: Project; Type: TABLE DATA; Schema: public; Owner: dripshoots_user
--

COPY public."Project" (id, "userId", name, status, gender, ethnicity, occasion, "createdAt") FROM stdin;
cmpx3sfkk0002u3x97c51e7wm	cmpfzj2xe0000xjtph8lqsqti	clothing · Outdoor · East Asian female	completed	female	East Asian	Outdoor	2026-06-02 20:41:57.716
cmpx3v44m000eu3x9i1irj0cb	cmpfzj2xe0000xjtph8lqsqti	clothing · Outdoor · East Asian female	completed	female	East Asian	Outdoor	2026-06-02 20:44:02.854
cmpx3x4zl000ju3x9iziezz55	cmpfzj2xe0000xjtph8lqsqti	clothing · Outdoor · East Asian female	completed	female	East Asian	Outdoor	2026-06-02 20:45:37.282
cmpx41q65000ou3x974u3f3oi	cmpx41q62000mu3x93aqlcsh3	clothing · Sport · South East Asian male	completed	male	South East Asian	Sport	2026-06-02 20:49:11.358
cmpx41svs000tu3x9e5e3nt5f	cmpfzj2xe0000xjtph8lqsqti	clothing · Outdoor · East Asian male	completed	male	East Asian	Outdoor	2026-06-02 20:49:14.872
cmpx4ff620010u3x9d09gcgry	cmpx41q62000mu3x93aqlcsh3	clothing · Sport · South Asian male	completed	male	South Asian	Sport	2026-06-02 20:59:50.282
cmpx4kg1p0016u3x9zvien3wt	cmpfzj2xe0000xjtph8lqsqti	clothing · Outdoor · East Asian female	completed	female	East Asian	Outdoor	2026-06-02 21:03:44.701
cmpx4uvsl0002c5r10rt2eygl	cmpfzj2xe0000xjtph8lqsqti	clothing · Outdoor · East Asian female	completed	female	East Asian	Outdoor	2026-06-02 21:11:51.669
cmpx4vjy40008c5r1ywjkb21f	cmpx41q62000mu3x93aqlcsh3	clothing · Sport · South Asian male	completed	male	South Asian	Sport	2026-06-02 21:12:22.973
cmpx4yx3c000gc5r1enttpwfq	cmpfzj2xe0000xjtph8lqsqti	clothing · Editorial · East Asian male	completed	male	East Asian	Editorial	2026-06-02 21:14:59.976
cmpx5du8x0002rxdqt5wev9pq	cmpx41q62000mu3x93aqlcsh3	clothing · Sport · South Asian male	completed	male	South Asian	Sport	2026-06-02 21:26:36.13
cmpx7sma5000213801m3tcc82	cmpx41q62000mu3x93aqlcsh3	clothing · Street Style · South Asian male	completed	male	South Asian	Street Style	2026-06-02 22:34:04.877
cmpye3jho0002k3pk0kf0no35	cmpx41q62000mu3x93aqlcsh3	fabric-male · Casual · South Asian male	completed	male	South Asian	Casual	2026-06-03 18:18:18.348
cmpznkq1b0006wxzximrmix0o	cmpfzj2xe0000xjtph8lqsqti	fabric-male · Studio · South East Asian male	completed	male	South East Asian	Studio	2026-06-04 15:31:22.703
cmpzuuold000317kjllc1ymj8	cmpfzj2xe0000xjtph8lqsqti	fabric-male · Studio · South East Asian male	completed	male	South East Asian	Studio	2026-06-04 18:55:04.705
cmq05nw3w0007xe7t5o6j6b5u	cmpx41q62000mu3x93aqlcsh3	clothing · Street Style · South Asian male	completed	male	South Asian	Street Style	2026-06-04 23:57:43.628
cmq05zmnr0004iyc0u90kqvgq	cmpfzj2xe0000xjtph8lqsqti	fabric-male · Studio · South East Asian male	completed	male	South East Asian	Studio	2026-06-05 00:06:51.255
cmq0649yz0009iyc0uz16qipd	cmpfzj2xe0000xjtph8lqsqti	fabric-male · Outdoor · South East Asian male	completed	male	South East Asian	Outdoor	2026-06-05 00:10:28.092
cmq06b6l3000iiyc00de0z7qd	cmpfzj2xe0000xjtph8lqsqti	fabric-male · Outdoor · Caucasian male	completed	male	Caucasian	Outdoor	2026-06-05 00:15:50.296
cmq06f8t0000piyc00krd6377	cmpfzj2xe0000xjtph8lqsqti	fabric-male · Outdoor · Arab male	completed	male	Arab	Outdoor	2026-06-05 00:18:59.796
cmq06ggh4000tiyc0b26clj8j	cmpx41q62000mu3x93aqlcsh3	clothing · Party · South Asian male	completed	male	South Asian	Party	2026-06-05 00:19:56.392
cmq06hiw1000ziyc0bm6pan5n	cmpfzj2xe0000xjtph8lqsqti	fabric-male · Studio · South East Asian male	completed	male	South East Asian	Studio	2026-06-05 00:20:46.177
cmq06k9tw0014iyc0p9vmv0ns	cmpfzj2xe0000xjtph8lqsqti	fabric-male · Office · African male	completed	male	African	Office	2026-06-05 00:22:54.405
cmq06u6ku001biyc0k2pssrbb	cmpx41q62000mu3x93aqlcsh3	shoes · Studio · African male	completed	male	African	Studio	2026-06-05 00:30:36.751
cmq06ykyh001jiyc0pzdre4tg	cmpx41q62000mu3x93aqlcsh3	hats · Editorial · Arab female	completed	female	Arab	Editorial	2026-06-05 00:34:02.009
cmq09m90i001uiyc0cbqnqqoq	cmpx41q62000mu3x93aqlcsh3	clothing · Editorial · Latino male	completed	male	Latino	Editorial	2026-06-05 01:48:25.506
cmq11iczz00031qilob70nohh	cmpfzj2xe0000xjtph8lqsqti	fabric-male · Office · South East Asian male	completed	male	South East Asian	Office	2026-06-05 14:49:13.296
cmq12s5jj00091qiltxcc89kb	cmpfzj2xe0000xjtph8lqsqti	clothing · Outdoor · South East Asian male	completed	male	South East Asian	Outdoor	2026-06-05 15:24:49.807
cmq12vst3000f1qil5kpo85ja	cmpfzj2xe0000xjtph8lqsqti	clothing · Studio · South East Asian male	completed	male	South East Asian	Studio	2026-06-05 15:27:39.927
cmq1300xx000o1qil1s4ftvar	cmpfzj2xe0000xjtph8lqsqti	clothing · Outdoor · East Asian male	completed	male	East Asian	Outdoor	2026-06-05 15:30:57.094
cmq13botj000w1qilkoailuc2	cmpfzj2xe0000xjtph8lqsqti	clothing · Studio · South East Asian male	completed	male	South East Asian	Studio	2026-06-05 15:40:01.255
cmq13mja800151qilcavqmw8a	cmpfzj2xe0000xjtph8lqsqti	fabric-male · Studio · South East Asian male	completed	male	South East Asian	Studio	2026-06-05 15:48:27.297
\.


--
-- Data for Name: Reel; Type: TABLE DATA; Schema: public; Owner: dripshoots_user
--

COPY public."Reel" (id, "projectId", "videoUrl", "createdAt") FROM stdin;
cmq133wbg000t1qill1m1xfj3	cmq1300xx000o1qil1s4ftvar	https://res.cloudinary.com/dkkbwkihu/video/upload/v1780673636/dripshoots/videos/gzrxlqihnxws2gtg3vic.mp4	2026-06-05 15:33:57.725
cmq13ezdm00121qil3sio2zji	cmq13botj000w1qilkoailuc2	https://res.cloudinary.com/dkkbwkihu/video/upload/v1780674153/dripshoots/videos/mqa6ef1vhhrx67kh55qk.mp4	2026-06-05 15:42:34.906
\.


--
-- Data for Name: Upload; Type: TABLE DATA; Schema: public; Owner: dripshoots_user
--

COPY public."Upload" (id, "projectId", "imageUrl", "createdAt") FROM stdin;
cmpx3sfkk0003u3x9r73sm55c	cmpx3sfkk0002u3x97c51e7wm	/uploads/cce9f78a-7538-4ab3-83d1-a93f6966e4fb.jpg	2026-06-02 20:41:57.716
cmpx3v44m000fu3x9igk6sec8	cmpx3v44m000eu3x9i1irj0cb	/uploads/cce9f78a-7538-4ab3-83d1-a93f6966e4fb.jpg	2026-06-02 20:44:02.854
cmpx3x4zl000ku3x9b6nt7jxb	cmpx3x4zl000ju3x9iziezz55	/uploads/59caba79-7904-4d4c-9413-4cd1a31f99c8.jpg	2026-06-02 20:45:37.282
cmpx41q65000pu3x9nvybne46	cmpx41q65000ou3x974u3f3oi	/uploads/e217b559-9109-410f-95c7-7644235aae37.jpg	2026-06-02 20:49:11.358
cmpx41svs000uu3x924vd60ra	cmpx41svs000tu3x9e5e3nt5f	/uploads/f43afc03-ba2b-4cdb-90fc-52d56e091a63.webp	2026-06-02 20:49:14.872
cmpx4ff620011u3x97cgi8bei	cmpx4ff620010u3x9d09gcgry	/uploads/da5fcb11-b899-475d-aabd-662d314cdbdb.jpg	2026-06-02 20:59:50.282
cmpx4kg1p0017u3x9l54p34zv	cmpx4kg1p0016u3x9zvien3wt	/uploads/b83f22db-09d3-48df-8652-9c58e2cb33c9.webp	2026-06-02 21:03:44.701
cmpx4uvsl0003c5r130qnpjlf	cmpx4uvsl0002c5r10rt2eygl	/uploads/c3037ccd-f396-429d-bb09-a136cf395e56.jpg	2026-06-02 21:11:51.669
cmpx4vjy40009c5r1qgocitre	cmpx4vjy40008c5r1ywjkb21f	/uploads/da5fcb11-b899-475d-aabd-662d314cdbdb.jpg	2026-06-02 21:12:22.973
cmpx4yx3c000hc5r1b7jg5v52	cmpx4yx3c000gc5r1enttpwfq	/uploads/83e43b91-30f3-41ba-982d-6357de2d926e.webp	2026-06-02 21:14:59.976
cmpx5du8x0003rxdqdqyv9adf	cmpx5du8x0002rxdqt5wev9pq	/uploads/893c817a-f05e-4da7-9c86-71caf598d871.jpg	2026-06-02 21:26:36.13
cmpx7sma500031380pyt5towm	cmpx7sma5000213801m3tcc82	/uploads/4a17eda0-8ff5-42ef-92ea-7348a6e01a4e.jpg	2026-06-02 22:34:04.877
cmpye3jho0003k3pkn7nokmdv	cmpye3jho0002k3pk0kf0no35	/uploads/3651c5dc-7f99-4268-8626-e213d6372698.webp	2026-06-03 18:18:18.348
cmpznkq1b0007wxzxwjbnhijw	cmpznkq1b0006wxzximrmix0o	/uploads/f5db75ee-1749-433f-9927-f2be52d3a93e.jpg	2026-06-04 15:31:22.703
cmpzuuold000417kjwua5k2cb	cmpzuuold000317kjllc1ymj8	/uploads/64620d44-8310-426d-8b46-e61459b4d9ec.jpg	2026-06-04 18:55:04.705
cmq05nw3w0008xe7tbuulcrpx	cmq05nw3w0007xe7t5o6j6b5u	/uploads/6fd20ab1-5e82-4a1e-a1c0-8cbea23fa713.jpg	2026-06-04 23:57:43.628
cmq05zmnr0005iyc0qs6s6vwj	cmq05zmnr0004iyc0u90kqvgq	/uploads/30d991b2-fa5f-43d5-a8bb-df19ec9908cf.jpg	2026-06-05 00:06:51.255
cmq0649yz000aiyc0r49hv6y4	cmq0649yz0009iyc0uz16qipd	/uploads/8462eda7-6a65-461f-bbe4-e72d54174a46.webp	2026-06-05 00:10:28.092
cmq06b6l3000jiyc0myorl8yw	cmq06b6l3000iiyc00de0z7qd	/uploads/e2a0fd49-f652-4b7e-b874-394626b407ac.webp	2026-06-05 00:15:50.296
cmq06f8t0000qiyc0mch6zzhl	cmq06f8t0000piyc00krd6377	/uploads/033e12b6-8b24-49f1-ab24-1c1d8b48b782.jpg	2026-06-05 00:18:59.796
cmq06ggh4000uiyc0pdjj2g8v	cmq06ggh4000tiyc0b26clj8j	/uploads/1c4223d2-d7ff-476d-90b2-8b887fed0843.jpg	2026-06-05 00:19:56.392
cmq06hiw10010iyc0rjr8d0pd	cmq06hiw1000ziyc0bm6pan5n	/uploads/1f164aed-1f6a-4688-b301-989335edd5f8.jpg	2026-06-05 00:20:46.177
cmq06k9tw0015iyc0laretohe	cmq06k9tw0014iyc0p9vmv0ns	/uploads/78b501ce-b33b-4289-a2ae-7d5f594b573e.jpg	2026-06-05 00:22:54.405
cmq06u6ku001ciyc099zfcdce	cmq06u6ku001biyc0k2pssrbb	/uploads/dc3a2bcf-8203-443e-ac75-7a85f26a0db6.jpg	2026-06-05 00:30:36.751
cmq06ykyh001kiyc09pio5vwh	cmq06ykyh001jiyc0pzdre4tg	/uploads/3466cd49-8fa1-44c1-a1f8-12a4752080a1.jpg	2026-06-05 00:34:02.009
cmq09m90i001viyc0y884fren	cmq09m90i001uiyc0cbqnqqoq	/uploads/ebc61712-15c4-4285-899c-5e1887109c7f.jpg	2026-06-05 01:48:25.506
cmq11id0000041qilriaqa3rn	cmq11iczz00031qilob70nohh	/uploads/092007d6-44a5-4d04-b24f-39a0e2412922.webp	2026-06-05 14:49:13.296
cmq12s5jj000a1qily9tspfno	cmq12s5jj00091qiltxcc89kb	/uploads/f978d680-9403-4da2-acdc-ec5758fbcda0.jpg	2026-06-05 15:24:49.807
cmq12vst3000g1qil1uru1n02	cmq12vst3000f1qil5kpo85ja	/uploads/74e9fdc1-4a2b-404a-b606-747864a6faa1.jpg	2026-06-05 15:27:39.927
cmq1300xx000p1qilaapd8xiv	cmq1300xx000o1qil1s4ftvar	/uploads/0eb11c37-fe5d-4230-a22f-49b4a87c0a03.jpg	2026-06-05 15:30:57.094
cmq13botj000x1qil2fznixcw	cmq13botj000w1qilkoailuc2	/uploads/17bf4e67-5996-456d-95ca-8bdb5d9139b6.jpg	2026-06-05 15:40:01.255
cmq13mja800161qilnoaxyg3j	cmq13mja800151qilcavqmw8a	/uploads/a1a74206-f005-4e6f-9cbd-7015ff34d4e7.webp	2026-06-05 15:48:27.297
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: dripshoots_user
--

COPY public."User" (id, "clerkId", email, "createdAt", "wpAppPassword", "wpConsumerKey", "wpConsumerSecret", "wpSiteUrl", credits, "creditsLimit", "creditsUsed", plan, "planExpiresAt", "stripeCustomerId", "approvedAt", "approvedBy", "pkrPlan", status) FROM stdin;
cmq040u900000cua9uob86ose	user_3DuMpDc00RQvFbHCXHamD7ZrZom	mfaizan518@gmail.com	2026-06-04 23:11:48.516	\N	\N	\N	\N	500	500	0	pro	\N	\N	\N	\N	free	active
cmpfzj2xe0000xjtph8lqsqti	user_3DgmRGC7FSgOp5H4l5fFmOQjCY3	mariyamsaleem470@gmail.com	2026-05-21 21:10:37.97	\N	\N	\N	\N	17	15	30	free_trial	\N	\N	2026-06-04 23:30:06.321	mfaizan518@gmail.com	free	active
cmpx41q62000mu3x93aqlcsh3	user_3Eb2J03MIpKVNtjk4sgf6sCmSMX	aarav.kummar6002@gmail.com	2026-06-02 20:49:11.344	\N	\N	\N	\N	2	15	13	free_trial	\N	\N	2026-06-04 23:52:57.941	mfaizan518@gmail.com	free	active
\.


--
-- Name: GeneratedImage GeneratedImage_pkey; Type: CONSTRAINT; Schema: public; Owner: dripshoots_user
--

ALTER TABLE ONLY public."GeneratedImage"
    ADD CONSTRAINT "GeneratedImage_pkey" PRIMARY KEY (id);


--
-- Name: Project Project_pkey; Type: CONSTRAINT; Schema: public; Owner: dripshoots_user
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_pkey" PRIMARY KEY (id);


--
-- Name: Reel Reel_pkey; Type: CONSTRAINT; Schema: public; Owner: dripshoots_user
--

ALTER TABLE ONLY public."Reel"
    ADD CONSTRAINT "Reel_pkey" PRIMARY KEY (id);


--
-- Name: Upload Upload_pkey; Type: CONSTRAINT; Schema: public; Owner: dripshoots_user
--

ALTER TABLE ONLY public."Upload"
    ADD CONSTRAINT "Upload_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: dripshoots_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: User_clerkId_key; Type: INDEX; Schema: public; Owner: dripshoots_user
--

CREATE UNIQUE INDEX "User_clerkId_key" ON public."User" USING btree ("clerkId");


--
-- Name: GeneratedImage GeneratedImage_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dripshoots_user
--

ALTER TABLE ONLY public."GeneratedImage"
    ADD CONSTRAINT "GeneratedImage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Project Project_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dripshoots_user
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Reel Reel_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dripshoots_user
--

ALTER TABLE ONLY public."Reel"
    ADD CONSTRAINT "Reel_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Upload Upload_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dripshoots_user
--

ALTER TABLE ONLY public."Upload"
    ADD CONSTRAINT "Upload_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict WcDHU6VheyJBigxD1vlRBfNoVFOJV17Fv3b3bZACOlVJjgJaqTcMX6JhCe2IHhq

