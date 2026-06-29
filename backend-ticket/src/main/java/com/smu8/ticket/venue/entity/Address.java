package com.smu8.ticket.venue.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Address {
    @Column(length = 20)
    private String zoneNo; //구역번호
    @Column(length = 500)
    private String roadAddress; //도로주소
    @Column(length = 500)
    private String jibunAddress; //지번주소
    @Column(length = 500)
    private String detailAddress; //세부주소
    @Column(length = 200)
    private String buildingName;
}
