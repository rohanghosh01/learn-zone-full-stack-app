"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import * as API from "../../services/api";
import { Feed } from "@/components/feed/feed";
import { FeedSkeleton } from "../feed/feed-skeleton";
import { useSelector } from "react-redux";

export const UserFeeds = ({ user }: any) => {
  const [feeds, setFeeds] = useState<any | []>([]);
  const [saves, setSaves] = useState<any | []>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("feed");
  const [isMore, setIsMore] = useState(true);
  const [query, setQuery] = useState({
    limit: 10,
    offset: 0,
  });
  const currentUser = useSelector((state: any) => state?.user);

  const getFeeds = async (tab: any = "feed") => {
    if (!isMore) return;
    try {
      if (tab == "feed") {
        let res: any = await API.feedList({ userId: user?.id, ...query });
        if (res && res.results && res.results.length) {
          setFeeds((prev: any) => {
            const existingIds = new Set(prev.map((item: any) => item.id));
            const filteredData = res.results.filter(
              (ele: any) => !existingIds.has(ele.id)
            );

            return [...prev, ...filteredData];
          });
          // setFeeds((prevFeeds: any) => [...(prevFeeds || []), ...res.results]);
        }
      }
      if (tab == "saved") {
        let res: any = await API.feedSavedList({ ...query });
        if (res && res.results && res.results.length) {
          setSaves((prev: any) => {
            const existingIds = new Set(prev.map((item: any) => item.id));
            const filteredData = res.results.filter(
              (ele: any) => !existingIds.has(ele.id)
            );

            return [...prev, ...filteredData];
          });
          // setSaves((prevFeeds: any) => [...(prevFeeds || []), ...res.results]);
        }
      }
    } catch (error: any) {
      console.log(error);
      if (error.message == "404") {
        setIsMore(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (!isMore) return;
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      const updatedOffset = query.offset + query.limit;
      setQuery({
        ...query,
        offset: updatedOffset,
      });
    }
  };

  useEffect(() => {
    getFeeds(tab);
    // Scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [query, tab]);

  const handleUpdateFeeds = () => {
    setQuery({
      limit: 10,
      offset: 0,
    });
    getFeeds(tab);
  };

  const handleTabChange = (newTab: any) => {
    console.log(">>>>>newTab", newTab);
    console.log(">>>>>tab", tab);
    if (newTab !== tab) {
      setTab(newTab);
      setIsMore(true);
      setQuery({
        limit: 10,
        offset: 0,
      });
    }
  };

  useEffect(() => {
    setIsMore(true);
    setTab("feed");
  }, []);

  const FeedList = ({ feedData }: any) => {
    return (
      <div
        // className="grid  sm:grid-cols-2 min-[1600px]:grid-cols-4 min-[1900px]:grid-cols-5  lg:grid-cols-3  md:grid-cols-2 gap-10 my-4 justify-center h-full "
        className="grid  sm:grid-cols-2 min-[1600px]:grid-cols-3 min-[1900px]:grid-cols-4  lg:grid-cols-2  md:grid-cols-2 gap-10 ml-10 my-4 justify-center"
      >
        {loading ? (
          <React.Fragment>
            {Array.from({ length: 5 }, (_, index) => (
              <FeedSkeleton key={index} isGrid={true} />
            ))}
          </React.Fragment>
        ) : (
          <>
            {feedData && feedData.length ? (
              feedData.map((feed: any, index: number) => (
                <Feed
                  key={index}
                  data={feed}
                  onUpdateFeeds={handleUpdateFeeds}
                  feeds={feeds}
                  setFeeds={setFeeds}
                  isGrid={true}
                  tab={tab}
                />
              ))
            ) : (
              <div className="col-span-4 flex flex-col justify-center items-center">
                <img src="/assets/no-results-found.png" alt="no-records" />
                <h2 className="text-xl font-bold">
                  Sorry there are no feeds available
                </h2>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="p-4">
      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="inline-flex h-9 items-center text-muted-foreground w-full rounded-none border-b bg-transparent p-0 border-t-0 gap-10 justify-center">
          <TabsTrigger
            value="feed"
            className="inline-flex items-center justify-center whitespace-nowrap py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            onClick={() => {
              handleTabChange("feed");
            }}
          >
            Feeds
          </TabsTrigger>
          {currentUser?.id == user?.id && (
            <TabsTrigger
              value="saved"
              className="inline-flex items-center justify-center whitespace-nowrap py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              onClick={() => {
                handleTabChange("saved");
              }}
            >
              Saved
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="feed">
          <FeedList feedData={feeds} />
        </TabsContent>
        {currentUser?.id == user?.id && (
          <TabsContent value="saved">
            <FeedList feedData={saves} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
