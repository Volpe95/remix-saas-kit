dockerize -wait tcp://postgres:5432 -timeout 20s

echo "Start server"
yarn prisma migrate dev --name init  # prisma migrate
yarm prisma db seed  # seed database
yarn run dev
