import { getToken } from "@lib/helper";
import { createClient } from "@utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Logo from "@../public/autozone-logo.svg";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  renderToStream,
  Image,
} from "@react-pdf/renderer";
import { Service } from "@lib/types";
import { format } from "date-fns";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "egp" }).format(
    value
  );

const marginBetweenSections = 5;
const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },

  page: {
    paddingTop: 10,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },

  relSections: {
    maxWidth: 250,
  },
  subTitle: { fontSize: 10, fontWeight: "bold", paddingBottom: 5 },
  relvInfo: {
    fontSize: 9,
    marginTop: 1,
  },
  image: {
    height: 120,
    width: 220,
    marginTop: 2,
    marginLeft: "auto",
    marginRight: "auto",
  },

  invoiceSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  invoice: {
    fontSize: 15,
    fontWeight: "bold",
  },
  date: {
    fontSize: 7,
    marginTop: marginBetweenSections,
  },

  section: {
    margin: marginBetweenSections,
    padding: 10,
    flexGrow: 1,
  },
  tableCell: {
    width: "calc(100%/5)",
    fontSize: 12,
  },
  detailsSection: {
    display: "flex",
    flexDirection: "row",
  },
  detialsColumn: {
    width: "calc(100%/4)",
    display: "flex",
    flexDirection: "column",
  },
});

// Create Document Component
const MyDocument = ({ service }: { service: Service }) => {
  const client = service.clients;
  const car = service.cars;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image
          source="https://umkyoinqpknmedkowqva.supabase.co/storage/v1/object/public/makerLogos//AutoZone-Logo.wine.png"
          // src="https://umkyoinqpknmedkowqva.supabase.co/storage/v1/object/public/makerLogos//autozone-logo.svg"
          style={styles.image}
        />

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {/* Start Client */}
          <View style={{ display: "flex", flexDirection: "row", gap: 30 }}>
            <View style={styles.relSections}>
              <Text style={styles.subTitle}>ISSUED TO</Text>
              <Text style={styles.relvInfo}>{client.name}</Text>
              <Text style={styles.relvInfo}>{client.email}</Text>
              <Text style={styles.relvInfo}>Plate Num: {car.plateNumber}</Text>
              <Text style={styles.relvInfo}>
                {client.phones && client.phones.length
                  ? client.phones[0].number
                  : ""}
              </Text>
            </View>
            {/* End Client */}

            {/* Start compony */}
            <View style={styles.relSections}>
              <Text style={styles.subTitle}>FROM</Text>
              <Text style={styles.relvInfo}>Mohammed Osama</Text>
              <Text style={styles.relvInfo}>Auto Zone</Text>
              <Text style={styles.relvInfo}>Some addressssssssss</Text>
              <Text style={styles.relvInfo}>01129442476</Text>
            </View>
            {/* End compony */}
          </View>

          {/* Invoice  */}
          <View
            style={{
              maxWidth: 250,
              // display: "flex",
              // flexDirection: "column",
              // justifyContent: "flex-end",
            }}
          >
            <Text style={{ ...styles.subTitle, marginLeft: "auto" }}>
              INVOICE NO.
            </Text>
            <Text style={{ ...styles.relvInfo, marginLeft: "auto" }}>
              {" "}
              #{String(service.id).padStart(2, "0")}
            </Text>
            <Text style={{ ...styles.relvInfo, marginLeft: "auto" }}>
              {" "}
              Date: {format(service.created_at, "MMMM dd, yyyy")}
            </Text>
          </View>
          {/* Invoice  */}
        </View>

        {/* Details */}
        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
            marginTop: 50,
            marginBottom: 7,
          }}
        >
          Details
        </Text>
        <View style={{ marginBottom: 20 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: 5,
              borderBottom: 1,
              borderBottomStyle: "solid",
              borderBottomColor: "black",
              paddingBottom: 1,
            }}
          >
            <Text style={{ ...styles.tableCell, fontWeight: "bold" }}>
              Description
            </Text>
            <Text style={{ ...styles.tableCell, fontWeight: "bold" }}>
              Price per unit
            </Text>
            <Text style={{ ...styles.tableCell, fontWeight: "bold" }}>
              Discount per unit
            </Text>
            <Text
              style={{ ...styles.tableCell, fontWeight: "bold", marginLeft: 6 }}
            >
              Count
            </Text>
            <Text style={{ ...styles.tableCell, fontWeight: "bold" }}>
              Total
            </Text>
          </View>

          <View>
            {service.productsToSell.map((pro) => {
              return (
                <View
                  key={pro.id}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginVertical: 5,
                  }}
                >
                  <Text style={{ ...styles.tableCell, paddingRight: 3 }}>
                    ssssssssssss{pro.product.name}
                  </Text>
                  <Text style={styles.tableCell}>
                    {formatCurrency(pro.pricePerUnit)}
                  </Text>
                  <Text style={styles.tableCell}>
                    {formatCurrency(pro.discount)}
                  </Text>
                  <Text style={{ ...styles.tableCell, marginLeft: 6 }}>
                    {pro.count}
                  </Text>
                  <Text style={styles.tableCell}>
                    {formatCurrency(pro.totalPriceAfterDiscount)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Details */}
      </Page>
    </Document>
  );
};
export async function GET(req: NextRequest, res: NextResponse) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url || "");
  const id = searchParams.get("id");
  const { data: services, error } = await supabase
    .from("services")
    .select(
      "*,productsToSell(*,product(*)),servicesFee(*),clients(*,phones(*)),cars(*)"
    )
    .eq("id", id);

  console.log("Returend data>>>>", services, error);

  if (error)
    return new NextResponse(JSON.stringify({ error: `${error.message}` }), {
      status: 500,
    });
  if (!services || !services.length)
    return new NextResponse(
      JSON.stringify({ error: `No matching service found` }),
      { status: 500 }
    );
  const data = services[0];

  const stream = await renderToStream(<MyDocument service={data} />);
  return new NextResponse(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=invoice.pdf",
    },
  });
}

// export async function GET(req: NextRequest, res: NextResponse) {
//   const token = getToken();
//   const { searchParams } = new URL(req.url || "");
//   const id = searchParams.get("id");

//   const externalApiUrl = `${process.env.API_URL}/api/Services/pdf/${id}`;

//   const response = await fetch(externalApiUrl, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   const pdfBuffer = await response.arrayBuffer();

//   return new NextResponse(pdfBuffer, {
//     headers: {
//       "Content-Type": "application/pdf",
//       "Content-Disposition": "attachment; filename=downloaded.pdf",
//     },
//   });
// }
