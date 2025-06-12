# How To Make REST API Calls With cURL

[![Promo](https://github.com/luminati-io/LinkedIn-Scraper/raw/main/Proxies%20and%20scrapers%20GitHub%20bonus%20banner.png)](https://brightdata.com/)

This guide explains how to use cURL for REST API requests like GET, POST, PUT, and DELETE, and enhance efficiency with Web Unlocker proxies.

- [cURL Installation](#curl-installation)
- [How to Use cURL](#how-to-use-curl)
  - [Making a GET Request](#making-a-get-request)
  - [Making a POST Request](#making-a-post-request)
  - [Making a PUT Request](#making-a-put-request)
  - [Making a DELETE Request](#making-a-delete-request)
- [cURL with Web Unlocker](#curl-with-web-unlocker)
- [What Other Options Are There?](#what-other-options-are-there)
- [Conclusion](#conclusion)

## cURL Installation

cURL comes preinstalled on most major operating systems today, including Linux, macOS, and Windows You can check your install of cURL with the following command.

```bash
curl --version
```

If cURL is properly installed, this will display information about the version and build of cURL. If you don’t have cURL installed, you can find a version matching your OS on the downloads page [here](https://curl.se/download.html).

## How to Use cURL

### Making a GET Request

`GET` is the most common HTTP request used by web browsers every time they are fetching a page. With cURL, we use the `GET` flag to perform one. The example below sends a `GET` to `https://jsonplaceholder.typicode.com/posts`.

```bash
curl -X GET https://jsonplaceholder.typicode.com/posts
```

This is a snippet of the response to the above request:

```json
{
    "userId": 1,
    "id": 1,
    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
  },
  {
    "userId": 1,
    "id": 2,
    "title": "qui est esse",
    "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
  },
  {
    "userId": 1,
    "id": 3,
    "title": "ea molestias quasi exercitationem repellat qui ipsa sit aut",
    "body": "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut"
  },
  {
    "userId": 1,
    "id": 4,
    "title": "eum et est occaecati",
    "body": "ullam et saepe reiciendis voluptatem adipisci\nsit amet autem assumenda provident rerum culpa\nquis hic commodi nesciunt rem tenetur doloremque ipsam iure\nquis sunt voluptatem rerum illo velit"
  },
  {
    "userId": 1,
    "id": 5,
    "title": "nesciunt quas odio",
    "body": "repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque"
  },

```

### Making a POST Request

The `POST` request sends information to a server to be saved in a database. The example below sends a `POST` to create a new post using the API.

```bash
curl -X POST https://jsonplaceholder.typicode.com/posts \
     -H "Content-Type: application/json" \
     -d '{
           "title": "foo",
           "body": "bar",
           "userId": 1
         }'

```

The response to the request contains the actual post object:

```json
{
  "title": "foo",
  "body": "bar",
  "userId": 1,
  "id": 101
}
```

### Making a PUT Request

To edit an object that already exists in a database, use a `PUT` request. The example below updates our previous post body from `bar` to `updated bar`.

```bash
curl -X PUT https://jsonplaceholder.typicode.com/posts/1 \
     -H "Content-Type: application/json" \
     -d '{
           "id": 1,
           "title": "foo",
           "body": "updated bar",
           "userId": 1
         }'

```

cURL will print the updated body of the post after sending the above reqest:

```json
{
  "id": 1,
  "title": "foo",
  "body": "updated bar",
  "userId": 1
}
```

### Making a DELETE Request

The `DELETE` request is used to remove an existing object from a database using a unique identifier which in out case is `1`. Here is the command that performs that request:

```bash
curl -X DELETE https://jsonplaceholder.typicode.com/posts/1
```

The response is an empty JSON object, which means the post has been deleted.

```json
{}
```

## cURL with Web Unlocker

When using cURL with [Web Unlocker](https://brightdata.com/products/web-unlocker), you can perform HTTP requests in the same way as with standard cURL. However, Web Unlocker enhances your capabilities by providing proxy support, geotargeting, and CAPTCHA solving, powered by some of the most reliable proxies available.

After setting up Web Unlocker, make sure you save your username, zone name, and password for authentication. The example below demonstrates how to configure the connection to use a US-based proxy.

```bash
curl -i --proxy brd.superproxy.io:33335 --proxy-user brd-customer-<YOUR_USERNAME>-zone-<YOUR_ZONE_NAME>-country-us:<YOUR_PASSWORD> -k "https://geo.brdtest.com/mygeo.json"
```

- `-i`: Instructs cURL to include headers in the response, which is helpful for debugging purposes.
- `--proxy brd.superproxy.io:33335 --proxy-user brd-customer-<YOUR_USERNAME>-zone-<YOUR_ZONE_NAME>-country-us:<YOUR_PASSWORD>`
  - `--proxy brd.superproxy.io:33335`: Specifies a proxy located at the given address to be used. `brd.superproxy.io:33335`.
  - `--proxy-user brd-customer-<YOUR_USERNAME>-zone-<YOUR_ZONE_NAME>-country-us:<YOUR_PASSWORD>`: This represents our authentication string in the `<username>:<password>` format. With Web Unlocker, your full username includes all of the following: `brd-customer-<YOUR_USERNAME>-zone-<YOUR_ZONE_NAME>-country-us`.
- `k` tells cURL that we want to bypass SSL certification.

Here is the example response. Note that our location is showing up in `New Jersey`:

```json
{
  "country": "US",
  "asn": { "asnum": 20473, "org_name": "AS-VULTR" },
  "geo": {
    "city": "Piscataway",
    "region": "NJ",
    "region_name": "New Jersey",
    "postal_code": "08854",
    "latitude": 40.5511,
    "longitude": -74.4606,
    "tz": "America/New_York",
    "lum_city": "piscataway",
    "lum_region": "nj"
  }
}
```

## What Other Options Are There?

Once you’ve gained a good understanding of cURL and HTTP, you can use HTTP in virtually any context. For general API testing, GUI tools like [Postman](https://www.postman.com/) and [Insomnia](https://insomnia.rest/) are excellent options.

In Python, you can work with libraries like Requests or even integrate cURL directly within your scripts. For JavaScript, tools like Node-Fetch and Axios are available to automate HTTP requests.

If you prefer command-line tools, there are several great options to explore. Tools like [HTTPie](https://httpie.io/) and wget are powerful utilities for handling HTTP requests from the command line.

## Conclusion

cURL has been the command line standard for decades and it’s not going to change any time soon. However, if you need to bypass advanced bot protections, try [Web Unlocker](https://brightdata.com/products/web-unlocker). It has a simple API you can use with your preferred programming language and includes intelligent proxy management.
