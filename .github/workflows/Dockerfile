FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

COPY TaskFlow.Api/TaskFlow.Api.csproj ./TaskFlow.Api/
RUN dotnet restore TaskFlow.Api/TaskFlow.Api.csproj

COPY TaskFlow.Api/ ./TaskFlow.Api/
RUN dotnet publish TaskFlow.Api/TaskFlow.Api.csproj -c Release -o /out

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /out .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "TaskFlow.Api.dll"]