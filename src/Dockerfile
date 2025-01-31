# Этап для разработки и сборки клиента
FROM node:23 AS client
WORKDIR /app
COPY Chroniq.WebClient/package.json .
RUN npm i
COPY Chroniq.WebClient .
RUN npm run build

# Этап для разработки и сборки
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Chroniq/Chroniq.csproj", "Chroniq/"]
RUN dotnet restore "Chroniq/Chroniq.csproj"
COPY . .
WORKDIR "/src/Chroniq"
RUN dotnet build "Chroniq.csproj" -c Release -o /app/build

# Публикуем приложение  
FROM build AS publish
RUN dotnet publish "Chroniq.csproj" -c Release -o /app/publish

# Конечный образ для продакшн-среды
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=client /app/dist ./wwwroot
EXPOSE 80
ENTRYPOINT ["dotnet", "Chroniq.dll"]