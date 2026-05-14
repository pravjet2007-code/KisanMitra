--
-- PostgreSQL database dump
--


-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.reviews DROP CONSTRAINT IF EXISTS reviews_reviewer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.reviews DROP CONSTRAINT IF EXISTS reviews_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_seller_id_fkey;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_category_id_fkey;
ALTER TABLE IF EXISTS ONLY public.payments DROP CONSTRAINT IF EXISTS payments_order_id_fkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_shipping_address_id_fkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_buyer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.order_status_history DROP CONSTRAINT IF EXISTS order_status_history_updated_by_fkey;
ALTER TABLE IF EXISTS ONLY public.order_status_history DROP CONSTRAINT IF EXISTS order_status_history_order_id_fkey;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_seller_id_fkey;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_parent_category_id_fkey;
ALTER TABLE IF EXISTS ONLY public.cart_items DROP CONSTRAINT IF EXISTS cart_items_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.cart_items DROP CONSTRAINT IF EXISTS cart_items_buyer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.addresses DROP CONSTRAINT IF EXISTS addresses_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_user_uuid_key;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_phone_number_key;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE IF EXISTS ONLY public.reviews DROP CONSTRAINT IF EXISTS reviews_pkey;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_product_uuid_key;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_pkey;
ALTER TABLE IF EXISTS ONLY public.payments DROP CONSTRAINT IF EXISTS payments_transaction_id_key;
ALTER TABLE IF EXISTS ONLY public.payments DROP CONSTRAINT IF EXISTS payments_pkey;
ALTER TABLE IF EXISTS ONLY public.payments DROP CONSTRAINT IF EXISTS payments_order_id_key;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_pkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_order_uuid_key;
ALTER TABLE IF EXISTS ONLY public.order_status_history DROP CONSTRAINT IF EXISTS order_status_history_pkey;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_pkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_pkey;
ALTER TABLE IF EXISTS ONLY public.cart_items DROP CONSTRAINT IF EXISTS cart_items_pkey;
ALTER TABLE IF EXISTS ONLY public.addresses DROP CONSTRAINT IF EXISTS addresses_pkey;
ALTER TABLE IF EXISTS public.users ALTER COLUMN user_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.reviews ALTER COLUMN review_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.products ALTER COLUMN product_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.payments ALTER COLUMN payment_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.orders ALTER COLUMN order_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.order_status_history ALTER COLUMN history_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.order_items ALTER COLUMN order_item_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.categories ALTER COLUMN category_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.cart_items ALTER COLUMN cart_item_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.addresses ALTER COLUMN address_id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.users_user_id_seq;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.reviews_review_id_seq;
DROP TABLE IF EXISTS public.reviews;
DROP SEQUENCE IF EXISTS public.products_product_id_seq;
DROP TABLE IF EXISTS public.products;
DROP SEQUENCE IF EXISTS public.payments_payment_id_seq;
DROP TABLE IF EXISTS public.payments;
DROP SEQUENCE IF EXISTS public.orders_order_id_seq;
DROP TABLE IF EXISTS public.orders;
DROP SEQUENCE IF EXISTS public.order_status_history_history_id_seq;
DROP TABLE IF EXISTS public.order_status_history;
DROP SEQUENCE IF EXISTS public.order_items_order_item_id_seq;
DROP TABLE IF EXISTS public.order_items;
DROP SEQUENCE IF EXISTS public.categories_category_id_seq;
DROP TABLE IF EXISTS public.categories;
DROP SEQUENCE IF EXISTS public.cart_items_cart_item_id_seq;
DROP TABLE IF EXISTS public.cart_items;
DROP SEQUENCE IF EXISTS public.addresses_address_id_seq;
DROP TABLE IF EXISTS public.addresses;
DROP TYPE IF EXISTS public.userrole;
DROP TYPE IF EXISTS public.user_role;
DROP TYPE IF EXISTS public.producttype;
DROP TYPE IF EXISTS public.product_type;
DROP TYPE IF EXISTS public.paymentstatus;
DROP TYPE IF EXISTS public.payment_status;
DROP TYPE IF EXISTS public.orderstatus;
DROP TYPE IF EXISTS public.order_status;
DROP EXTENSION IF EXISTS pgcrypto;
--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: order_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_status AS ENUM (
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED'
);


ALTER TYPE public.order_status -- OWNER TO postgres;

--
-- Name: orderstatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.orderstatus AS ENUM (
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED'
);


ALTER TYPE public.orderstatus -- OWNER TO postgres;

--
-- Name: payment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_status AS ENUM (
    'PENDING',
    'SUCCESS',
    'FAILED',
    'REFUNDED'
);


ALTER TYPE public.payment_status -- OWNER TO postgres;

--
-- Name: paymentstatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.paymentstatus AS ENUM (
    'PENDING',
    'SUCCESS',
    'FAILED',
    'REFUNDED'
);


ALTER TYPE public.paymentstatus -- OWNER TO postgres;

--
-- Name: product_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.product_type AS ENUM (
    'PRODUCE',
    'INPUT'
);


ALTER TYPE public.product_type -- OWNER TO postgres;

--
-- Name: producttype; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.producttype AS ENUM (
    'PRODUCE',
    'INPUT'
);


ALTER TYPE public.producttype -- OWNER TO postgres;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'FARMER',
    'VENDOR',
    'BUYER'
);


ALTER TYPE public.user_role -- OWNER TO postgres;

--
-- Name: userrole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.userrole AS ENUM (
    'FARMER',
    'VENDOR',
    'BUYER'
);


ALTER TYPE public.userrole -- OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.addresses (
    address_id integer NOT NULL,
    user_id integer NOT NULL,
    address_type character varying(50),
    street_address text,
    city character varying(100),
    state character varying(100),
    pincode character varying(20),
    is_default boolean DEFAULT false
);


ALTER TABLE public.addresses -- OWNER TO postgres;

--
-- Name: addresses_address_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.addresses_address_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.addresses_address_id_seq -- OWNER TO postgres;

--
-- Name: addresses_address_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.addresses_address_id_seq OWNED BY public.addresses.address_id;


--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    cart_item_id integer NOT NULL,
    buyer_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity numeric(10,2) NOT NULL,
    added_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cart_items -- OWNER TO postgres;

--
-- Name: cart_items_cart_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_items_cart_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_items_cart_item_id_seq -- OWNER TO postgres;

--
-- Name: cart_items_cart_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_items_cart_item_id_seq OWNED BY public.cart_items.cart_item_id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    category_id integer NOT NULL,
    name character varying(255) NOT NULL,
    parent_category_id integer
);


ALTER TABLE public.categories -- OWNER TO postgres;

--
-- Name: categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_category_id_seq -- OWNER TO postgres;

--
-- Name: categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.category_id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    order_item_id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    seller_id integer NOT NULL,
    quantity numeric(10,2) NOT NULL,
    price_at_purchase numeric(10,2) NOT NULL
);


ALTER TABLE public.order_items -- OWNER TO postgres;

--
-- Name: order_items_order_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_order_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_order_item_id_seq -- OWNER TO postgres;

--
-- Name: order_items_order_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_order_item_id_seq OWNED BY public.order_items.order_item_id;


--
-- Name: order_status_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_status_history (
    history_id integer NOT NULL,
    order_id integer NOT NULL,
    status public.order_status NOT NULL,
    updated_by integer,
    comments text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.order_status_history -- OWNER TO postgres;

--
-- Name: order_status_history_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_status_history_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_status_history_history_id_seq -- OWNER TO postgres;

--
-- Name: order_status_history_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_status_history_history_id_seq OWNED BY public.order_status_history.history_id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    order_id integer NOT NULL,
    buyer_id integer NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    shipping_address_id integer,
    current_status public.order_status DEFAULT 'PENDING'::public.order_status,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    order_uuid uuid DEFAULT gen_random_uuid()
);


ALTER TABLE public.orders -- OWNER TO postgres;

--
-- Name: orders_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_order_id_seq -- OWNER TO postgres;

--
-- Name: orders_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    payment_id integer NOT NULL,
    order_id integer NOT NULL,
    transaction_id character varying(255),
    amount numeric(10,2) NOT NULL,
    payment_method character varying(100),
    status public.payment_status DEFAULT 'PENDING'::public.payment_status,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.payments -- OWNER TO postgres;

--
-- Name: payments_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_payment_id_seq -- OWNER TO postgres;

--
-- Name: payments_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_payment_id_seq OWNED BY public.payments.payment_id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    product_id integer NOT NULL,
    seller_id integer NOT NULL,
    category_id integer,
    type public.product_type NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    price_per_unit numeric(10,2) NOT NULL,
    unit_of_measure character varying(50),
    stock_quantity numeric(10,2) NOT NULL,
    harvest_date date,
    shelf_life_days integer,
    farming_method character varying(100),
    image_url text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_active boolean DEFAULT true,
    product_uuid uuid DEFAULT gen_random_uuid()
);


ALTER TABLE public.products -- OWNER TO postgres;

--
-- Name: products_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_product_id_seq -- OWNER TO postgres;

--
-- Name: products_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_product_id_seq OWNED BY public.products.product_id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    review_id integer NOT NULL,
    product_id integer NOT NULL,
    reviewer_id integer NOT NULL,
    rating integer,
    comment text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.reviews -- OWNER TO postgres;

--
-- Name: reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_review_id_seq -- OWNER TO postgres;

--
-- Name: reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_review_id_seq OWNED BY public.reviews.review_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    full_name character varying(255) NOT NULL,
    phone_number character varying(20) NOT NULL,
    email character varying(255),
    password_hash character varying(255) NOT NULL,
    role public.user_role NOT NULL,
    is_verified boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_uuid uuid DEFAULT gen_random_uuid()
);


ALTER TABLE public.users -- OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq -- OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: addresses address_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses ALTER COLUMN address_id SET DEFAULT nextval('public.addresses_address_id_seq'::regclass);


--
-- Name: cart_items cart_item_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN cart_item_id SET DEFAULT nextval('public.cart_items_cart_item_id_seq'::regclass);


--
-- Name: categories category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);


--
-- Name: order_items order_item_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN order_item_id SET DEFAULT nextval('public.order_items_order_item_id_seq'::regclass);


--
-- Name: order_status_history history_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status_history ALTER COLUMN history_id SET DEFAULT nextval('public.order_status_history_history_id_seq'::regclass);


--
-- Name: orders order_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);


--
-- Name: payments payment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN payment_id SET DEFAULT nextval('public.payments_payment_id_seq'::regclass);


--
-- Name: products product_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);


--
-- Name: reviews review_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN review_id SET DEFAULT nextval('public.reviews_review_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.addresses VALUES (1, 1, 'Farm', 'Green Fields, Sector 5', 'Nashik', 'Maharashtra', '422001', true);
INSERT INTO public.addresses VALUES (2, 2, 'Farm', 'Rural Road 12', 'Amritsar', 'Punjab', '143001', true);
INSERT INTO public.addresses VALUES (3, 7, 'Home', 'HSR Layout', 'Bangalore', 'Karnataka', '560102', true);
INSERT INTO public.addresses VALUES (4, 8, 'Home', 'Civil Lines', 'Nagpur', 'Maharashtra', '440001', true);
INSERT INTO public.addresses VALUES (5, 9, 'Home', 'Anna Nagar', 'Chennai', 'Tamil Nadu', '600040', true);
INSERT INTO public.addresses VALUES (6, 10, 'Home', 'Salt Lake', 'Kolkata', 'West Bengal', '700091', true);
INSERT INTO public.addresses VALUES (7, 3, 'Farm', 'Village 4', 'Indore', 'Madhya Pradesh', '452001', true);
INSERT INTO public.addresses VALUES (8, 4, 'Farm', 'Hillside Plot', 'Shimla', 'Himachal Pradesh', '171001', true);
INSERT INTO public.addresses VALUES (9, 5, 'Warehouse', 'Industrial Area', 'Pune', 'Maharashtra', '411001', true);
INSERT INTO public.addresses VALUES (10, 6, 'Warehouse', 'Kapashera', 'New Delhi', 'Delhi', '110037', true);


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.cart_items VALUES (1, 7, 1, 5.00, '2026-05-05 13:12:26.056632');
INSERT INTO public.cart_items VALUES (2, 7, 3, 10.00, '2026-05-05 13:12:26.056632');
INSERT INTO public.cart_items VALUES (3, 8, 5, 2.00, '2026-05-05 13:12:26.056632');
INSERT INTO public.cart_items VALUES (4, 8, 2, 3.00, '2026-05-05 13:12:26.056632');
INSERT INTO public.cart_items VALUES (5, 9, 9, 4.00, '2026-05-05 13:12:26.056632');
INSERT INTO public.cart_items VALUES (6, 9, 10, 1.00, '2026-05-05 13:12:26.056632');
INSERT INTO public.cart_items VALUES (7, 10, 4, 15.00, '2026-05-05 13:12:26.056632');
INSERT INTO public.cart_items VALUES (8, 10, 6, 2.00, '2026-05-05 13:12:26.056632');
INSERT INTO public.cart_items VALUES (9, 7, 7, 1.00, '2026-05-05 13:12:26.056632');
INSERT INTO public.cart_items VALUES (10, 8, 8, 2.00, '2026-05-05 13:12:26.056632');


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.categories VALUES (1, 'Grains', NULL);
INSERT INTO public.categories VALUES (2, 'Pulses', NULL);
INSERT INTO public.categories VALUES (3, 'Vegetables', NULL);
INSERT INTO public.categories VALUES (4, 'Fruits', NULL);
INSERT INTO public.categories VALUES (5, 'Organic Fertilizers', NULL);
INSERT INTO public.categories VALUES (6, 'Hybrid Seeds', NULL);
INSERT INTO public.categories VALUES (7, 'Pesticides', NULL);
INSERT INTO public.categories VALUES (8, 'Farm Tools', NULL);
INSERT INTO public.categories VALUES (9, 'Dairy Products', NULL);
INSERT INTO public.categories VALUES (10, 'Spices', NULL);


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.order_items VALUES (1, 1, 1, 1, 5.00, 85.00);
INSERT INTO public.order_items VALUES (2, 1, 3, 2, 10.00, 35.00);
INSERT INTO public.order_items VALUES (3, 2, 5, 3, 2.00, 600.00);
INSERT INTO public.order_items VALUES (4, 3, 2, 1, 3.00, 120.00);
INSERT INTO public.order_items VALUES (5, 4, 9, 6, 1.00, 350.00);
INSERT INTO public.order_items VALUES (6, 5, 7, 5, 10.00, 450.00);
INSERT INTO public.order_items VALUES (7, 6, 4, 2, 3.00, 40.00);
INSERT INTO public.order_items VALUES (8, 7, 6, 4, 14.00, 150.00);
INSERT INTO public.order_items VALUES (9, 8, 8, 5, 4.00, 200.00);
INSERT INTO public.order_items VALUES (10, 9, 10, 6, 2.00, 180.00);


--
-- Data for Name: order_status_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.order_status_history VALUES (1, 1, 'PENDING', NULL, 'Order received', '2026-05-05 13:12:26.056632');
INSERT INTO public.order_status_history VALUES (2, 1, 'CONFIRMED', NULL, 'Payment verified', '2026-05-05 13:12:26.056632');
INSERT INTO public.order_status_history VALUES (3, 1, 'DELIVERED', NULL, 'Handed over to buyer', '2026-05-05 13:12:26.056632');
INSERT INTO public.order_status_history VALUES (4, 2, 'PENDING', NULL, 'Waiting for stock', '2026-05-05 13:12:26.056632');
INSERT INTO public.order_status_history VALUES (5, 2, 'SHIPPED', NULL, 'In transit via BlueDart', '2026-05-05 13:12:26.056632');
INSERT INTO public.order_status_history VALUES (6, 3, 'PROCESSING', NULL, 'Farmer is packing the produce', '2026-05-05 13:12:26.056632');
INSERT INTO public.order_status_history VALUES (7, 5, 'CONFIRMED', NULL, 'Stock locked for buyer', '2026-05-05 13:12:26.056632');
INSERT INTO public.order_status_history VALUES (8, 6, 'CANCELLED', NULL, 'Buyer requested cancellation', '2026-05-05 13:12:26.056632');
INSERT INTO public.order_status_history VALUES (9, 7, 'DELIVERED', NULL, 'Delivered at Salt Lake address', '2026-05-05 13:12:26.056632');
INSERT INTO public.order_status_history VALUES (10, 10, 'DELIVERED', NULL, 'Fresh delivery completed', '2026-05-05 13:12:26.056632');


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.orders VALUES (1, 7, 1200.00, 3, 'DELIVERED', '2026-05-05 13:12:26.056632', '28671eb9-b288-45ce-a07e-90c93972da03');
INSERT INTO public.orders VALUES (2, 8, 2500.00, 4, 'SHIPPED', '2026-05-05 13:12:26.056632', '0db736e1-740f-4654-a3fe-ed2fd28a5d9f');
INSERT INTO public.orders VALUES (3, 9, 800.00, 5, 'PROCESSING', '2026-05-05 13:12:26.056632', '3233edc6-e18d-4297-bc8a-165a386bc34a');
INSERT INTO public.orders VALUES (4, 10, 350.00, 6, 'PENDING', '2026-05-05 13:12:26.056632', '4641862e-adac-465a-87d5-037d37ba9d32');
INSERT INTO public.orders VALUES (5, 7, 4500.00, 3, 'CONFIRMED', '2026-05-05 13:12:26.056632', '10816522-9f77-4ef5-b4cc-c69e3fef9a3b');
INSERT INTO public.orders VALUES (6, 8, 150.00, 4, 'CANCELLED', '2026-05-05 13:12:26.056632', '827449e9-9b20-4897-bde8-ab08f9ccad1f');
INSERT INTO public.orders VALUES (7, 9, 2100.00, 5, 'DELIVERED', '2026-05-05 13:12:26.056632', '9cdf3444-9f57-438a-9073-1712b7e9e88b');
INSERT INTO public.orders VALUES (8, 10, 950.00, 6, 'SHIPPED', '2026-05-05 13:12:26.056632', '3bdeea44-4d11-47df-b566-ed64ad88946e');
INSERT INTO public.orders VALUES (9, 7, 300.00, 3, 'PROCESSING', '2026-05-05 13:12:26.056632', '279ef4ef-c118-4aa2-9968-8bc0d7212a3d');
INSERT INTO public.orders VALUES (10, 8, 550.00, 4, 'DELIVERED', '2026-05-05 13:12:26.056632', '30f1c784-986a-4f38-93c0-54e10a5697ab');


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.payments VALUES (1, 1, 'TXN_001', 1200.00, 'UPI', 'SUCCESS', '2026-05-05 13:12:26.056632');
INSERT INTO public.payments VALUES (2, 2, 'TXN_002', 2500.00, 'Card', 'SUCCESS', '2026-05-05 13:12:26.056632');
INSERT INTO public.payments VALUES (3, 3, 'TXN_003', 800.00, 'UPI', 'SUCCESS', '2026-05-05 13:12:26.056632');
INSERT INTO public.payments VALUES (4, 4, 'TXN_004', 350.00, 'COD', 'PENDING', '2026-05-05 13:12:26.056632');
INSERT INTO public.payments VALUES (5, 5, 'TXN_005', 4500.00, 'NetBanking', 'SUCCESS', '2026-05-05 13:12:26.056632');
INSERT INTO public.payments VALUES (6, 7, 'TXN_007', 2100.00, 'UPI', 'SUCCESS', '2026-05-05 13:12:26.056632');
INSERT INTO public.payments VALUES (7, 8, 'TXN_008', 950.00, 'Card', 'SUCCESS', '2026-05-05 13:12:26.056632');
INSERT INTO public.payments VALUES (8, 9, 'TXN_009', 300.00, 'UPI', 'SUCCESS', '2026-05-05 13:12:26.056632');
INSERT INTO public.payments VALUES (9, 10, 'TXN_010', 550.00, 'Card', 'SUCCESS', '2026-05-05 13:12:26.056632');
INSERT INTO public.payments VALUES (10, 6, 'TXN_006', 150.00, 'UPI', 'REFUNDED', '2026-05-05 13:12:26.056632');


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.products VALUES (1, 1, 1, 'PRODUCE', 'Premium Basmati Rice', 'Long grain aromatic rice from Punjab', 85.00, 'kg', 500.00, NULL, NULL, 'Traditional', '/static/uploads/product_1_rice_1778655231631.png', '2026-05-05 13:12:26.056632', true, '083844f2-2986-42f2-8a41-83a0fef3544a');
INSERT INTO public.products VALUES (2, 1, 2, 'PRODUCE', 'Organic Moong Dal', 'Rich in protein, chemical-free', 120.00, 'kg', 300.00, NULL, NULL, 'Organic', '/static/uploads/product_2_moong_dal_1778655253569.png', '2026-05-05 13:12:26.056632', true, '34d40310-2e92-490b-afac-b4dc378dd350');
INSERT INTO public.products VALUES (3, 2, 3, 'PRODUCE', 'Fresh Red Onions', 'Crispy and pungent Nashik onions', 35.00, 'kg', 1000.00, NULL, NULL, 'Traditional', '/static/uploads/product_3_onions_1778655268731.png', '2026-05-05 13:12:26.056632', true, 'ac419461-6722-49cd-858f-716cf2ea84b3');
INSERT INTO public.products VALUES (4, 2, 3, 'PRODUCE', 'Organic Potatoes', 'Freshly harvested from the hills', 40.00, 'kg', 800.00, NULL, NULL, 'Organic', '/static/uploads/product_4_potatoes_1778655285981.png', '2026-05-05 13:12:26.056632', true, 'd5ac18b3-2c10-40e7-83d8-d1d7b52e3140');
INSERT INTO public.products VALUES (5, 3, 4, 'PRODUCE', 'Alphonso Mangoes', 'King of mangoes from Ratnagiri', 600.00, 'dozen', 100.00, NULL, NULL, 'Traditional', '/static/uploads/product_5_mangoes_1778655301221.png', '2026-05-05 13:12:26.056632', true, '7b4b3635-4d07-4500-a748-2405d353aae9');
INSERT INTO public.products VALUES (6, 4, 10, 'PRODUCE', 'Dried Red Chillies', 'Extra spicy Guntur chillies', 150.00, 'kg', 200.00, NULL, NULL, 'Traditional', '/static/uploads/product_6_chillies_1778655325245.png', '2026-05-05 13:12:26.056632', true, '537c7432-d89e-4a7c-a37f-1ddfe60a45af');
INSERT INTO public.products VALUES (7, 5, 5, 'INPUT', 'NPK Fertilizer', 'High quality balanced fertilizer', 450.00, 'bag', 50.00, NULL, NULL, 'Industrial', '/static/uploads/product_7_fertilizer_1778655341927.png', '2026-05-05 13:12:26.056632', true, '6ec9de74-45b3-42fc-84ed-5d15ccedf7bb');
INSERT INTO public.products VALUES (8, 5, 7, 'INPUT', 'Neem Oil Pesticide', 'Natural pest control for crops', 200.00, 'liter', 100.00, NULL, NULL, 'Organic', '/static/uploads/product_8_neem_oil_1778655357835.png', '2026-05-05 13:12:26.056632', true, '7e95967c-4634-4d11-96b3-7991a8afe2d0');
INSERT INTO public.products VALUES (9, 6, 6, 'INPUT', 'Hybrid Corn Seeds', 'High yield variety for summer', 350.00, 'packet', 150.00, NULL, NULL, 'Industrial', '/static/uploads/product_9_corn_seeds_1778655376024.png', '2026-05-05 13:12:26.056632', true, 'c0593b34-f869-4e10-9f56-3246535655f7');
INSERT INTO public.products VALUES (10, 6, 8, 'INPUT', 'Steel Sickle', 'Handheld tool for harvesting', 180.00, 'piece', 30.00, NULL, NULL, 'Industrial', '/static/uploads/product_10_sickle_1778655395032.png', '2026-05-05 13:12:26.056632', true, '8cb812ec-3660-4a91-81bf-952efd4e5d36');


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.reviews VALUES (1, 1, 7, 5, 'Best basmati rice I ever had!', '2026-05-05 13:12:26.056632');
INSERT INTO public.reviews VALUES (2, 2, 7, 4, 'Very good quality pulses.', '2026-05-05 13:12:26.056632');
INSERT INTO public.reviews VALUES (3, 3, 8, 5, 'Fresh onions, delivered fast.', '2026-05-05 13:12:26.056632');
INSERT INTO public.reviews VALUES (4, 5, 9, 3, 'Mangoes were okay, but slightly expensive.', '2026-05-05 13:12:26.056632');
INSERT INTO public.reviews VALUES (5, 9, 10, 5, 'Great germination rate for these seeds.', '2026-05-05 13:12:26.056632');
INSERT INTO public.reviews VALUES (6, 10, 7, 4, 'Sturdy tool, works well.', '2026-05-05 13:12:26.056632');
INSERT INTO public.reviews VALUES (7, 7, 8, 5, 'My crops are much healthier now.', '2026-05-05 13:12:26.056632');
INSERT INTO public.reviews VALUES (8, 1, 9, 4, 'Good aroma and long grains.', '2026-05-05 13:12:26.056632');
INSERT INTO public.reviews VALUES (9, 2, 10, 5, 'Perfect for daily cooking.', '2026-05-05 13:12:26.056632');
INSERT INTO public.reviews VALUES (10, 6, 8, 2, 'Package was slightly damaged.', '2026-05-05 13:12:26.056632');
INSERT INTO public.reviews VALUES (11, 1, 2, 4, 'the product quality is the best', '2026-05-05 15:01:38.586497');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (1, 'Rajesh Kumar', '9812345670', 'rajesh@farmer.com', 'hashed_pass', 'FARMER', true, '2026-05-05 13:12:26.056632', 'b44003a9-3f0b-4af0-89ff-4e7cc4408cd3');
INSERT INTO public.users VALUES (2, 'Anita Devi', '9812345671', 'anita@farmer.com', 'hashed_pass', 'FARMER', true, '2026-05-05 13:12:26.056632', 'b7836ed0-2b12-4e8e-90e1-8842e3e19823');
INSERT INTO public.users VALUES (3, 'Vikram Singh', '9812345672', 'vikram@farmer.com', 'hashed_pass', 'FARMER', true, '2026-05-05 13:12:26.056632', 'b3141405-2ac3-47b3-97c0-91890cff811b');
INSERT INTO public.users VALUES (4, 'Sunita Sharma', '9812345673', 'sunita@farmer.com', 'hashed_pass', 'FARMER', true, '2026-05-05 13:12:26.056632', 'd76caf23-3cc2-4b9e-9f7c-e298fae41fa8');
INSERT INTO public.users VALUES (5, 'Agro Inputs Ltd', '9812345674', 'sales@agroinputs.com', 'hashed_pass', 'VENDOR', true, '2026-05-05 13:12:26.056632', '1977cf9f-1fa0-4555-91c4-b8f522954bba');
INSERT INTO public.users VALUES (6, 'Green Seeds Co', '9812345675', 'info@greenseeds.com', 'hashed_pass', 'VENDOR', true, '2026-05-05 13:12:26.056632', 'e54278c4-c80a-44fd-891b-bae2e4cb38c7');
INSERT INTO public.users VALUES (7, 'Amit Verma', '9812345676', 'amit@buyer.com', 'hashed_pass', 'BUYER', true, '2026-05-05 13:12:26.056632', '74b5c5d8-994e-4343-9720-e601fe31918e');
INSERT INTO public.users VALUES (8, 'Meera Reddy', '9812345677', 'meera@buyer.com', 'hashed_pass', 'BUYER', true, '2026-05-05 13:12:26.056632', '778d8a04-5f52-4885-9bd2-aecf638d42eb');
INSERT INTO public.users VALUES (9, 'Sanjay Gupta', '9812345678', 'sanjay@buyer.com', 'hashed_pass', 'BUYER', true, '2026-05-05 13:12:26.056632', '35fd3229-be25-4ff2-9d30-9902f4034b77');
INSERT INTO public.users VALUES (10, 'Pooja Rao', '9812345679', 'pooja@buyer.com', 'hashed_pass', 'BUYER', true, '2026-05-05 13:12:26.056632', '78eb98d3-44c5-4a91-b712-259e0bbd4048');


--
-- Name: addresses_address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.addresses_address_id_seq', 10, true);


--
-- Name: cart_items_cart_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_items_cart_item_id_seq', 28, true);


--
-- Name: categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_category_id_seq', 10, true);


--
-- Name: order_items_order_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_order_item_id_seq', 10, true);


--
-- Name: order_status_history_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_status_history_history_id_seq', 10, true);


--
-- Name: orders_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_order_id_seq', 10, true);


--
-- Name: payments_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_payment_id_seq', 10, true);


--
-- Name: products_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_product_id_seq', 10, true);


--
-- Name: reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_review_id_seq', 11, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 11, true);


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (address_id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (cart_item_id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (order_item_id);


--
-- Name: order_status_history order_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT order_status_history_pkey PRIMARY KEY (history_id);


--
-- Name: orders orders_order_uuid_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_uuid_key UNIQUE (order_uuid);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- Name: payments payments_order_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_key UNIQUE (order_id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);


--
-- Name: payments payments_transaction_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key UNIQUE (transaction_id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);


--
-- Name: products products_product_uuid_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_product_uuid_key UNIQUE (product_uuid);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (review_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_number_key UNIQUE (phone_number);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_user_uuid_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_user_uuid_key UNIQUE (user_uuid);


--
-- Name: addresses addresses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: cart_items cart_items_buyer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;


--
-- Name: categories categories_parent_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_category_id_fkey FOREIGN KEY (parent_category_id) REFERENCES public.categories(category_id) ON DELETE SET NULL;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE CASCADE;


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE RESTRICT;


--
-- Name: order_items order_items_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(user_id) ON DELETE RESTRICT;


--
-- Name: order_status_history order_status_history_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT order_status_history_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE CASCADE;


--
-- Name: order_status_history order_status_history_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT order_status_history_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(user_id) ON DELETE SET NULL;


--
-- Name: orders orders_buyer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.users(user_id) ON DELETE RESTRICT;


--
-- Name: orders orders_shipping_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_shipping_address_id_fkey FOREIGN KEY (shipping_address_id) REFERENCES public.addresses(address_id) ON DELETE SET NULL;


--
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE RESTRICT;


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON DELETE SET NULL;


--
-- Name: products products_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: reviews reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;


--
-- Name: reviews reviews_reviewer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


