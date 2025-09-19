---
# Basic metadata
title: "Visualizing Singapore Government Spending"
slug: "visualise-spending"
date: "2019-01-01"
date_pretty: "Jan 1, 2019"
description: "Insights into how ministries and agencies spend, with visual analytics"
type: "project"
external_link: "https://wiki.smu.edu.sg/18191is428g1/GeViz"

# Hero/cover section
hero:
  image: "assets/Geviz_project_cover.png"
  alt: "Singapore government spending dashboard showing budget allocation across ministries with interactive charts"
  link: "https://is428-ay1819-geviz.shinyapps.io/Group7_GeViz/"
  link_text: "View Live Project"

# Project metadata
project:
  tags:
    - "Featured"
    - "Dashboard"
    - "R Shiny"
    - "Working in progress"

# Content structure
content_blocks:
  - type: "heading"
    level: 3
    text: "Project Overview"
  - type: "paragraph"
    text: "How do you make sense of billions in government spending? Singapore's government budget data is publicly available, but buried in dense spreadsheets. We built an interactive dashboard using R Shiny that transforms Singapore's complex budget data into clear, explorable visualizations."
  - type: "paragraph"
    text: "Read the complete project [here](https://wiki.smu.edu.sg/18191is428g1/GeViz)"

# Gallery
gallery:
  layout: "masonry"
  columns: 2
  items:
    - src: "assets/geviz/treemap.png"
      title: "An Overview of Agency Spending within Each Ministry"
      alt: "Overview"
      caption: "Treemap chart is used here to provide a birds-eye view of each each ministry's spending breakdown by agency and category. The size of the box represents number of procurement contracts of each procurement category while the colour intensity represents the total amount of good and services procured."
    - src: "assets/geviz/network.jpeg"
      title: "Relationships Between Agencies and Suppliers"
      alt: "Breakdown"
      caption: "To best represent the interlinked relationship beteewen suppliers and agencies under a selected ministry, network diagram was used to shows the common suppliers between agencies. The triangle icon represents agencies while the circle icon represents suppliers."
    - src: "assets/geviz/sangkey.jpeg"
      title: "Main Suppliers of an Agency by Spending Category"
      alt: "Sankey"
      caption: "This sankey diagram was created with R's NetworkD3 library, the chart shows the cash flow between a selected agency and its suppliers for a selected procurement category. The thickness of the path represents the total dollar amount of goods and services procured from a particular supplier."
    - src: "assets/geviz/wordcloud.jpeg"
      title: "A Glimpse into Goods and Services Procured"
      alt: "Word cloud"
      caption: "This word cloud was created with R's Wordcloud2 library, it shows the top goods and services procured by a selected agency and a selected category. The size of the word within the word cloud corresponds to the frequency of the word in the procurement descriptions."

# SEO and additional metadata
seo:
  keywords:
    - "Dashboard"
    - "R Shiny"
    - "Working in progress"
  og_image: "assets/Geviz_project_cover.png"
---

<!-- Optional markdown content can go here. -->
