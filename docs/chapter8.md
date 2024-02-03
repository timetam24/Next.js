# 8. Static and Dynamic Rendering

In the previous chapter, you fetched data for the Dashboard Overview page. However, we briefly discussed two limitations of the current setup:

1. The data requests are creating an unintentional waterfall.
2. The dashboard is static, so any data updates will not be reflected on your application.

<br/>

## In this chapter...

```
- What static rendering is and how it can improve your application's performance.
- What dynamic rendering is and when to use it.
- Different approaches to make your dashboard dynamic.
- Simulate a slow data fetch to see what happens.
```

<br/>

## Static Rendering

Whenever a user visits your application, the cached result is served. There are a couple of benefits of static rendering:

- <b>Faster Websites</b> - Prerendered content can be cached and globally distributed. This ensures that users around the world can access your website's content more quickly and reliably.
- <b>Reduced Server Load</b> - Because the content is cached, your server does not have to dynamically generate content for each user request.
- <b>SEO</b> - Prerendered content is easier for search engine crawlers to index, as the content is already available when the page loads. This can lead to improved search engine rankings.

<br/>

Static rendering is useful for UI with no data or data that is shared across users, such as a static blog post or a product page. It might not be a good fit for a dashboard that has personalized data that is regularly updated.

<br/>

## Dynamic Rendering

With dynamic rendering, content is rendered on the server for each user at request time (when the user visits the page). There are a couple of benefits of dynamic rendering:

- <b>Real-Time Data</b> - Dynamic rendering allows your application to display real-time or frequently updated data. This is ideal for applications where data changes often.
- <b>User-Specific Content</b> - It's easier to serve personalized content, such as dashboards or user profiles, and update the data based on user interaction.
- <b>Request Time Information</b> - Dynamic rendering allows you to access information that can only be known at request time, such as cookies or the URL search parameters.
