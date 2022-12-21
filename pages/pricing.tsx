import { Button, Card, Container, Grid, Stack, Text } from "@mantine/core";
import { Fragment } from "react";
import initStripe from "stripe";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

import { useUser } from "../context/user";
import { useRouter } from "next/router";

export default function Pricing({ plans }: any) {
  const { user, login, isLoading } = useUser();
  const router = useRouter();

  const showSubscribeButton = !!user && !user.is_subscribed;
  const showCreateAccountButton = !user;
  const showManageSubscription = !!user && user.is_subscribed;

  const processSubscription = async (planId: string) => {
    const { data } = await axios.get(`/api/subscription/${planId}`);
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
    );
    await stripe?.redirectToCheckout({ sessionId: data.id });
    // console.log(data);
  };

  return (
    <Container>
      <Grid>
        {plans.map((plan: any) => {
          return (
            <Grid.Col span={6} key={plan.name}>
              <Card
                withBorder
                radius={"sm"}
                sx={{ minHeight: 200, position: "relative" }}
              >
                <Stack>
                  <Fragment>
                    <Text>{plan.name}</Text>
                    <Text>
                      ₹ {plan.price / 100} / {plan.interval}{" "}
                    </Text>
                  </Fragment>

                  {!isLoading && (
                    <div style={{ position: "absolute", bottom: 10 }}>
                      {showSubscribeButton && (
                        <Button onClick={() => processSubscription(plan.id)}>
                          Subscribe
                        </Button>
                      )}
                      {showCreateAccountButton && (
                        <Button onClick={() => login()}>Create Account</Button>
                      )}
                      {showManageSubscription && (
                        <Button onClick={() => router.push("/profile")}>
                          Manage Subscription
                        </Button>
                      )}
                    </div>
                  )}
                </Stack>
              </Card>
            </Grid.Col>
          );
        })}
      </Grid>
    </Container>
  );
}

export const getStaticProps = async () => {
  const stripe = new initStripe(process.env.STRIPE_SECRET_KEY as string, {
    typescript: true,
    apiVersion: "2022-11-15",
  });

  const { data: prices } = await stripe.prices.list();

  const plans = await Promise.all(
    prices.map(async (price) => {
      const product = await stripe.products.retrieve(price.product.toString());

      return {
        id: price.id,
        name: product.name,
        price: price.unit_amount,
        interval: price.recurring?.interval,
        currency: price.currency,
      };
    })
  );

  //@ts-ignore
  const sortedPlans = plans.sort((a, b) => a.price - b.price);

  return {
    props: {
      plans: sortedPlans,
    },
  };
};
