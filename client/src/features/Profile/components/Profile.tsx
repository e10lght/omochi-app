import {
  Grid,
  GridItem,
  Avatar,
  Box,
  Heading,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";

export const Profile = () => {
  return (
    <>
      <Heading as="h3" size="lg" mt={2}>
        プロフィール
      </Heading>
      <Grid
        h="200px"
        templateRows="repeat(3, 1fr)"
        templateColumns="repeat(7, 1fr)"
        gap={1}
        placeItems="center"
      >
        <GridItem rowSpan={3} colSpan={3}>
          <Avatar
            w="150px"
            h="150px"
            name="Dan Abrahmov"
            src="omochi-avatar.png"
            // src="/src/assets/omochi-avatar.png"
          />
        </GridItem>

        <GridItem rowSpan={3} colSpan={4} w="100%">
          <Stack divider={<StackDivider />} spacing="2">
            <Box>
              <Heading size="xs" textTransform="uppercase">
                名前
              </Heading>
              <Text pt="1" fontSize="sm">
                おもち
              </Text>
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                生年月日
              </Heading>
              <Text pt="1" fontSize="sm">
                2023年11月11日
              </Text>
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                性別
              </Heading>
              <Text pt="1" fontSize="sm">
                男の子
              </Text>
            </Box>
          </Stack>
        </GridItem>
        {/* <GridItem colSpan={2} bg="tomato" >

        </GridItem>
        <GridItem colSpan={2} bg="papayawhip" >

        </GridItem> */}
      </Grid>
    </>
  );
};
