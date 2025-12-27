FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Asisya.Backend.sln", "."]
COPY ["Asisya.Api/Asisya.Api.csproj", "Asisya.Api/"]
COPY ["Asisya.Application/Asisya.Application.csproj", "Asisya.Application/"]
COPY ["Asisya.Domain/Asisya.Domain.csproj", "Asisya.Domain/"]
COPY ["Asisya.Infrastructure/Asisya.Infrastructure.csproj", "Asisya.Infrastructure/"]
COPY ["Asisya.Tests/Asisya.Tests.csproj", "Asisya.Tests/"]
RUN dotnet restore "Asisya.Backend.sln"
COPY . .
WORKDIR "/src/Asisya.Api"
RUN dotnet build "Asisya.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Asisya.Api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Asisya.Api.dll"]
